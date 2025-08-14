#include <QApplication>
#include <QButtonGroup>
#include <QClipboard>
#include <QDebug>
#include <QGraphicsColorizeEffect>
#include <QGuiApplication>
#include <QHBoxLayout>
#include <QHotkey>
#include <QLineEdit>
#include <QPointer>
#include <QProcess>
#include <QPropertyAnimation>
#include <QPushButton>
#include <QScreen>
#include <QScrollArea>
#include <QStringList>
#include <QThread>
#include <QVBoxLayout>
#include <QWidget>

#include "./src/VMSelectionOverlay.h"

// Get VM list
QStringList getVMList() {
  QStringList vmList;
  QProcess process;
  process.start("virsh", {"--connect", "qemu:///system", "list", "--all"});
  process.waitForFinished();

  QString output = process.readAllStandardOutput();
  QStringList lines = output.split('\n');

  for (int i = 2; i < lines.size(); ++i) {
    QString line = lines[i].trimmed();
    if (!line.isEmpty()) {
      QStringList parts = line.split(QRegExp("\\s+"), Qt::SkipEmptyParts);
      if (parts.size() >= 2) vmList << parts[1];
    }
  }
  return vmList;
}

// Convert text to virsh key sequences
QList<QStringList> textToKeySequences(const QString& text) {
  QList<QStringList> sequences;
  for (QChar c : text) {
    if (c.isLetter()) {
      if (c.isUpper())
        sequences << (QStringList() << "KEY_LEFTSHIFT" << QString("KEY_%1").arg(c));
      else
        sequences << (QStringList() << QString("KEY_%1").arg(c.toUpper()));
    } else if (c.isDigit()) {
      sequences << (QStringList() << QString("KEY_%1").arg(c));
    } else if (c == ' ') {
      sequences << (QStringList() << "KEY_SPACE");
    } else if (c == '\n') {
      sequences << (QStringList() << "KEY_ENTER");
    } else if (c == '+') {
      sequences << (QStringList() << "KEY_LEFTSHIFT" << "KEY_EQUAL");
    } else if (c == '-') {
      sequences << (QStringList() << "KEY_MINUS");
    } else if (c == '/') {
      sequences << (QStringList() << "KEY_SLASH");
    } else if (c == '=') {
      sequences << (QStringList() << "KEY_EQUAL");
    } else if (c == '.') {
      sequences << (QStringList() << "KEY_DOT");
    } else if (c == '_') {
      sequences << (QStringList() << "KEY_LEFTSHIFT" << "KEY_MINUS");
    }
  }
  return sequences;
}

// Flash QLineEdit
void flashLineEdit(QLineEdit* lineEdit, const QColor& color, int duration = 1000) {
  if (!lineEdit) return;
  QPointer<QGraphicsColorizeEffect> effect = new QGraphicsColorizeEffect(lineEdit);
  lineEdit->setGraphicsEffect(effect);
  effect->setColor(color);

  QPropertyAnimation* anim = new QPropertyAnimation(effect, "strength");
  anim->setDuration(duration);
  anim->setStartValue(1.0);
  anim->setEndValue(0.0);
  anim->start(QAbstractAnimation::DeleteWhenStopped);

  QObject::connect(anim, &QPropertyAnimation::finished, [lineEdit, effect]() {
    if (lineEdit) lineEdit->setGraphicsEffect(nullptr);
    if (effect) delete effect;
  });
}

// Helper: check if key is a modifier
bool isModifier(const QString& key) {
  return key == "KEY_LEFTSHIFT" || key == "KEY_LEFTCTRL" || key == "KEY_LEFTALT";
}

int main(int argc, char* argv[]) {
  QApplication app(argc, argv);

  QWidget window;
  window.setWindowTitle("VM Keystroke Sender");

  QString darkStyle = R"(
        QWidget { background-color: #161616; color: #f2f2f2; }
        QLineEdit { background-color: #212121; color: #f2f2f2; border-radius: 5px; padding: 5px; }
        QPushButton { background-color: #313131; color: #f2f2f2; border-radius: 5px; padding: 10px; }
        QPushButton:hover { background-color: #474747; }
        QPushButton:checked { background-color: #d40213; }
        QScrollArea { background-color: transparent; }
    )";
  window.setStyleSheet(darkStyle);

  QVBoxLayout* mainLayout = new QVBoxLayout(&window);

  // Scrollable VM buttons
  QScrollArea* scrollArea = new QScrollArea();
  scrollArea->setWidgetResizable(true);
  QWidget* scrollWidget = new QWidget();
  QHBoxLayout* hLayout = new QHBoxLayout(scrollWidget);
  hLayout->setSpacing(10);

  QButtonGroup* vmGroup = new QButtonGroup(&window);
  vmGroup->setExclusive(true);

  QStringList vms = getVMList();
  for (const QString& vm : vms) {
    QPushButton* btn = new QPushButton(vm);
    btn->setCheckable(true);
    btn->setMinimumWidth(120);
    hLayout->addWidget(btn);
    vmGroup->addButton(btn);
  }

  scrollWidget->setLayout(hLayout);
  scrollArea->setWidget(scrollWidget);
  mainLayout->addWidget(scrollArea);

  QLineEdit* inputBox = new QLineEdit();
  inputBox->setPlaceholderText("Paste text to send to VM");
  mainLayout->addWidget(inputBox);

  QPushButton* sendButton = new QPushButton("Send Keystrokes");
  mainLayout->addWidget(sendButton);

  QObject::connect(sendButton, &QPushButton::clicked, [&]() {
    QAbstractButton* selectedBtn = vmGroup->checkedButton();
    if (!selectedBtn) {
      flashLineEdit(inputBox, QColor("#b20203"));
      return;
    }

    QString vmName = selectedBtn->text();
    QString text = inputBox->text();
    if (text.isEmpty()) {
      flashLineEdit(inputBox, QColor("#b20203"));
      return;
    }

    QList<QStringList> sequences = textToKeySequences(text);

    QThread* thread = QThread::create([sequences, vmName, inputBox]() {
      bool success = true;
      QStringList batch;

      for (const QStringList& seq : sequences) {
        if (seq.size() == 2 && isModifier(seq[0])) {
          // send shift+key as single batch
          QStringList command;
          command << "--connect" << "qemu:///system" << "send-key" << vmName << "--codeset"
                  << "linux" << seq;
          QProcess process;
          process.start("virsh", command);
          process.waitForFinished();
          QByteArray err = process.readAllStandardError();
          if (!err.isEmpty()) {
            qDebug() << "[virsh stderr]:" << err;
            success = false;
          }
        } else {
          // group normal keys into batch
          batch << seq;
          if (batch.size() >= 10) {
            QStringList command;
            command << "--connect" << "qemu:///system" << "send-key" << vmName << "--codeset"
                    << "linux" << batch;
            QProcess process;
            process.start("virsh", command);
            process.waitForFinished();
            QByteArray err = process.readAllStandardError();
            if (!err.isEmpty()) {
              qDebug() << "[virsh stderr]:" << err;
              success = false;
            }
            batch.clear();
          }
        }
      }

      // send remaining batch
      if (!batch.isEmpty()) {
        QStringList command;
        command << "--connect" << "qemu:///system" << "send-key" << vmName << "--codeset" << "linux"
                << batch;
        QProcess process;
        process.start("virsh", command);
        process.waitForFinished();
        QByteArray err = process.readAllStandardError();
        if (!err.isEmpty()) {
          qDebug() << "[virsh stderr]:" << err;
          success = false;
        }
      }

      QMetaObject::invokeMethod(inputBox, [inputBox, success]() {
        flashLineEdit(inputBox, success ? QColor("#00763a") : QColor("#b20203"));
      });
    });

    thread->start();
  });

  QHotkey* pasteHotkey = new QHotkey(QKeySequence("Ctrl+Shift+p"), true, &window);
  QObject::connect(pasteHotkey, &QHotkey::activated, [&]() {
    QString clipboardText = QApplication::clipboard()->text();
    inputBox->setText(clipboardText);
    sendButton->click();
  });

  QHotkey* overlayHotkey = new QHotkey(QKeySequence("Ctrl+Shift+O"), true, &window);
  QObject::connect(overlayHotkey, &QHotkey::activated, [&]() {
    // Create overlay with the VM list
    VMSelectionOverlay* overlay = new VMSelectionOverlay(getVMList(), &window);

    // Make overlay fill the screen
    QRect screenGeometry = QGuiApplication::primaryScreen()->geometry();
    overlay->setGeometry(screenGeometry);

    // Connect VM selection signal
    QObject::connect(overlay, &VMSelectionOverlay::vmSelected, [&](QString vm) {
      for (auto btn : vmGroup->buttons()) {
        if (btn->text() == vm) {
          btn->setChecked(true);
          break;
        }
      }
    });

    // Show the overlay fullscreen
    overlay->showFullScreen();
  });

  QHotkey* toggleWindowHotkey = new QHotkey(QKeySequence("Ctrl+Shift+H"), true, &window);
  QObject::connect(toggleWindowHotkey, &QHotkey::activated, [&]() {
    if (window.isVisible()) {
      window.hide();
    } else {
      QScreen* screen = QGuiApplication::primaryScreen();
      QRect screenGeometry = screen->geometry();
      QSize windowSize = window.size();
      int x = screenGeometry.x() + (screenGeometry.width() - windowSize.width()) / 2;
      int y = screenGeometry.y() + (screenGeometry.height() - windowSize.height()) / 2;
      window.move(x, y);

      window.showNormal();
      window.activateWindow();
      window.raise();
    }
  });

  window.setLayout(mainLayout);
  window.resize(600, 250);
  window.hide();

  return app.exec();
}
