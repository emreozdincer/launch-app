# Changelog
This changelog is intended to display the development process for the coding challenge.

## [0.0.5] - 01-08-2019
### Added
- Implemented most of the *LaunchDetail* page except from missions tab
- Implemented a fake stack navigator logic between *Dashboard* and *LaunchDetail* the existing library one was buggy
- Added placeholder effects for images in *Dashboard* using *rn-placeholder* library
- Added new screenshots to readme

### Changed
- Refactored the *Header* in *Dashboard* into a re-usable component under /components

## [0.0.4] - 31-07-2019
### Added
- Implemented the required Card Views of Launches in Dashboard
- Added and started using react-native-elements and react-native-vector-icons UI libraries
- Added two helper methods for date parsing under /util
- Added screenshot of current version in the readme
### Changed
- Minor clean-up & refactoring

## [0.0.3] - 30-07-2019
### Added
- Added API logic in *Dashboard.js* that enables fetches of rocket data based on encoded query strings which then grabs smallest available img into a new state variable
### Fixed
- Fixed a bug that breaks the app when user tries to log in or sign up with no inputs
### Changed
- Minor clean-up & refactoring
 
## [0.0.2] - 29-07-2019
### Changed
- Changed name of the *Main* component to *Dashboard* 
### Added
- Added initial API logic in *Dashboard.js* that enables fetches for launch data within specified time range

## [0.0.1] - 28-07-2019
### Added
- Initiated app with simple Login/SignUp/SignOut authentication flow using Firebase

[0.0.5]: https://github.com/emreozdincer/launch-app/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/emreozdincer/launch-app/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/emreozdincer/launch-app/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/emreozdincer/launch-app/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/emreozdincer/launch-app/releases/tag/v0.0.1
