#include "VMSelectionOverlay.h"

#include <QPainter>
#include <QScrollBar>

VMSelectionOverlay::VMSelectionOverlay(QStringList vmList, QWidget* parent)
    : QWidget(parent), vmList(vmList) {
  setWindowFlags(Qt::FramelessWindowHint | Qt::Dialog);
  setWindowModality(Qt::ApplicationModal);
  setAttribute(Qt::WA_TranslucentBackground);
  setAttribute(Qt::WA_DeleteOnClose);

  QVBoxLayout* mainLayout = new QVBoxLayout(this);
  mainLayout->setContentsMargins(50, 100, 50, 100);
  mainLayout->setSpacing(0);

  QWidget* container = new QWidget();
  container->setStyleSheet("background-color: rgba(30,30,30,0.95); border-radius: 20px;");

  QVBoxLayout* containerLayout = new QVBoxLayout(container);

  QScrollArea* scrollArea = new QScrollArea();
  scrollArea->setWidgetResizable(true);

  // Hide horizontal scrollbar unless needed
  scrollArea->setHorizontalScrollBarPolicy(Qt::ScrollBarAsNeeded);
  scrollArea->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);

  QWidget* scrollWidget = new QWidget();
  QHBoxLayout* hLayout = new QHBoxLayout(scrollWidget);
  hLayout->setSpacing(20);                 // some space between cards
  hLayout->setAlignment(Qt::AlignCenter);  // center cards in view

  for (const QString& vm : vmList) {
    QPushButton* btn = new QPushButton(vm);

    // Make cards square by setting a fixed aspect ratio
    btn->setFixedSize(200, 200);

    btn->setStyleSheet(
        "QPushButton { background-color: #f2f2f2; color: #090909; border-radius: 10px; font-size: "
        "18px; }"
        "QPushButton:hover { background-color: #d6d6d6; }");

    connect(btn, &QPushButton::clicked, this, [this, vm]() {
      emit vmSelected(vm);
      close();
    });

    hLayout->addWidget(btn);
  }

  scrollWidget->setLayout(hLayout);
  scrollArea->setWidget(scrollWidget);
  containerLayout->addWidget(scrollArea);
  mainLayout->addWidget(container);
}

void VMSelectionOverlay::paintEvent(QPaintEvent*) {
  QPainter p(this);
  p.setRenderHint(QPainter::Antialiasing);
  p.fillRect(rect(), QColor(0, 0, 0, 150));
}

void VMSelectionOverlay::mousePressEvent(QMouseEvent* event) {
  QWidget* child = childAt(event->pos());
  if (!child || qobject_cast<QPushButton*>(child) == nullptr) {
    close();
  }
}
