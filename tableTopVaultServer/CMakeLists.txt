cmake_minimum_required(VERSION 3.14)
project(vault)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# --------------------
# Fix Boost Find Policy for modern CMake
# --------------------
if(POLICY CMP0167)
  cmake_policy(SET CMP0167 NEW)
endif()

# --------------------
# Find dependencies
# --------------------
find_package(OpenSSL REQUIRED)
find_package(ZLIB REQUIRED)
find_package(Threads REQUIRED)
find_package(CURL REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(SODIUM REQUIRED libsodium)
find_package(yaml-cpp REQUIRED)

# --------------------
# Boost (modern CMake style)
# --------------------
find_package(Boost 1.70 REQUIRED COMPONENTS system thread)

include(FetchContent)

# --------------------
# nlohmann/json
# --------------------
find_package(nlohmann_json QUIET)
if(NOT nlohmann_json_FOUND)
  FetchContent_Declare(
    json
    URL https://github.com/nlohmann/json/releases/download/v3.11.2/json.tar.xz
    DOWNLOAD_EXTRACT_TIMESTAMP true
  )
  FetchContent_MakeAvailable(json)
endif()

# --------------------
# json-schema-validator
# --------------------
FetchContent_Declare(
  json_validator
  GIT_REPOSITORY https://github.com/pboettch/json-schema-validator.git
  GIT_TAG main
)
FetchContent_MakeAvailable(json_validator)

# --------------------
# Collect uWebSockets and uSockets sources
# --------------------
file(GLOB_RECURSE UWS_SRC
    ${CMAKE_SOURCE_DIR}/lib/uWebSockets/src/*.cpp
)

file(GLOB_RECURSE USOCKETS_SRC_C
    ${CMAKE_SOURCE_DIR}/lib/uWebSockets/uSockets/src/*.c
)
file(GLOB_RECURSE USOCKETS_SRC_CPP
    ${CMAKE_SOURCE_DIR}/lib/uWebSockets/uSockets/src/*.cpp
)

set(USOCKETS_SRC ${USOCKETS_SRC_C} ${USOCKETS_SRC_CPP})

# --------------------
# Vault main server build
# --------------------
add_executable(${PROJECT_NAME}
  vault.cpp
  src/server/serverUtils.cpp
  src/server/schema.cpp
  src/server/routes.cpp
  src/server/sockets.cpp
  src/server/vaultClient.cpp
  src/server/nginx.cpp
  src/server/sanitize.cpp
  ${UWS_SRC}
  ${USOCKETS_SRC}
)

target_compile_definitions(${PROJECT_NAME} PRIVATE
  LIBUS_USE_OPENSSL=1
  UWS_WITH_OPENSSL=1
  UWS_ENABLE_SSL=1
  UWS_ENABLE_TRACE=1
)

target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_SOURCE_DIR}/lib/uWebSockets/src
    ${CMAKE_SOURCE_DIR}/lib/uWebSockets/uSockets/src
    ${CMAKE_SOURCE_DIR}/lib/uWebSockets/deps/libuv/include
    ${OPENSSL_INCLUDE_DIR}
    ${CURL_INCLUDE_DIRS}
    ${SODIUM_INCLUDE_DIRS}
)

target_link_libraries(${PROJECT_NAME} PRIVATE
    OpenSSL::SSL
    OpenSSL::Crypto
    ZLIB::ZLIB
    Threads::Threads
    CURL::libcurl
    nlohmann_json::nlohmann_json
    nlohmann_json_schema_validator
    yaml-cpp
    ${SODIUM_LIBRARIES}
)

# --------------------
# CLI helper for vault requests
# --------------------
add_executable(vault_requests vault_requests.cpp)

target_include_directories(vault_requests PRIVATE
    ${SODIUM_INCLUDE_DIRS}
)

target_link_libraries(vault_requests PRIVATE
    Boost::system
    Boost::thread
    ${SODIUM_LIBRARIES}
    nlohmann_json::nlohmann_json
    OpenSSL::SSL
    OpenSSL::Crypto
    yaml-cpp
)

install(TARGETS vault_requests RUNTIME DESTINATION bin)
