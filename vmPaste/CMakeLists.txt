cmake_minimum_required(VERSION 3.16)
project(vmPaste LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Qt5 packages
find_package(Qt5 COMPONENTS Widgets REQUIRED)

# Add QHotkey as subdirectory
set(QHOTKEY_ENABLE_CPACK OFF CACHE BOOL "" FORCE)
add_subdirectory(lib/QHotkey)

# Add the executable
add_executable(vmPaste 
  vmPaste.cpp
  src/VMSelectionOverlay.cpp
)

# Enable automatic MOC, UIC, and RCC (Qt meta-object compiler)
set_target_properties(vmPaste PROPERTIES
    AUTOMOC ON
    AUTOUIC ON
    AUTORCC ON
)

# Link Qt5 libraries and QHotkey
target_link_libraries(vmPaste
    Qt5::Widgets
    QHotkey::QHotkey
)
