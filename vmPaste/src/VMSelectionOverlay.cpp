#include "VMSelectionOverlay.h"

#include <QPainter>
#include <QScrollBar>

// Declare the global variable from your main file
extern QString g_currentVM;

VMSelectionOverlay::VMSelectionOverlay(QStringList vmList, QWidget* parent)
    : QWidget(parent), vmList(vmList) {
  setWindowFlags(Qt::FramelessWindowHint | Qt::Dialog);
  setWindowModality(Qt::ApplicationModal);
  setAttribute(Qt::WA_TranslucentBackground);
  setAttribute(Qt::WA_DeleteOnClose);

  QVBoxLayout* mainLayout = new QVBoxLayout(this);
  mainLayout->setContentsMargins(50, 100, 50, 100);
  mainLayout->setSpacing(0);

  containerWidget = new QWidget();
  containerWidget->setStyleSheet("background-color: rgba(30,30,30,0.95); border-radius: 20px;");

  QVBoxLayout* containerLayout = new QVBoxLayout(containerWidget);

  QScrollArea* scrollArea = new QScrollArea();
  scrollArea->setWidgetResizable(true);
  scrollArea->setHorizontalScrollBarPolicy(Qt::ScrollBarAsNeeded);
  scrollArea->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);

  QWidget* scrollWidget = new QWidget();
  QHBoxLayout* hLayout = new QHBoxLayout(scrollWidget);
  hLayout->setSpacing(20);
  hLayout->setAlignment(Qt::AlignCenter);

  for (const QString& vm : vmList) {
    QPushButton* btn = new QPushButton(vm);
    btn->setFixedSize(200, 200);
    btn->setStyleSheet(
        "QPushButton { background-color: #f2f2f2; color: #090909; border-radius: 10px; font-size: "
        "18px; }"
        "QPushButton:hover { background-color: #d6d6d6; }");

    // Update the global variable directly when clicked
    connect(btn, &QPushButton::clicked, this, [this, vm]() {
      g_currentVM = vm;     // update global variable
      emit vmSelected(vm);  // optional, for any other signal handling
      this->hide();
    });

    hLayout->addWidget(btn);
  }

  scrollWidget->setLayout(hLayout);
  scrollArea->setWidget(scrollWidget);
  containerLayout->addWidget(scrollArea);
  mainLayout->addWidget(containerWidget);
}

void VMSelectionOverlay::paintEvent(QPaintEvent*) {
  QPainter p(this);
  p.setRenderHint(QPainter::Antialiasing);
  p.fillRect(rect(), QColor(0, 0, 0, 150));
}

void VMSelectionOverlay::mousePressEvent(QMouseEvent* event) {
  // Use the member container pointer (assume you stored it as containerWidget)
  if (containerWidget) {
    // Map event position to container coordinates
    QPoint posInContainer = containerWidget->mapFromParent(event->pos());
    if (!containerWidget->rect().contains(posInContainer)) {
      // Instead of close(), just hide to avoid quitting app
      this->hide();
    }
  } else {
    QWidget::mousePressEvent(event);
  }
}
