#ifndef VMSELECTIONOVERLAY_H
#define VMSELECTIONOVERLAY_H

#include <QHBoxLayout>
#include <QMouseEvent>
#include <QPaintEvent>
#include <QPushButton>
#include <QScrollArea>
#include <QStringList>
#include <QVBoxLayout>
#include <QWidget>

class VMSelectionOverlay : public QWidget {
  Q_OBJECT
 public:
  explicit VMSelectionOverlay(QStringList vmList, QWidget* parent = nullptr);

 signals:
  void vmSelected(QString vmName);

 protected:
  void paintEvent(QPaintEvent* event) override;
  void mousePressEvent(QMouseEvent* event) override;

 private:
  QStringList vmList;
  QWidget* containerWidget = nullptr;
};

#endif  // VMSELECTIONOVERLAY_H
