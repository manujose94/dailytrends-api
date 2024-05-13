# DailyTrends API

An API project that exposes a news feed.

## Table of Contents

- [DailyTrends API](#dailytrends-api)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
    - [Architecture](#architecture)
    - [Object Oriented Designs](#object-oriented-designs)
  - [Principals Tools](#principals-tools)
  - [Installation](#installation)
  - [Usage](#usage)

## Description

DailyTrends is an API that exposes a news feed aggregator. This feed collects news from different newspapers, focusing on the top headlines from leading newspapers. When a user accesses DailyTrends, they will see the top 5 headlines from `El País` and `El Mundo` for the current day. Additionally, users can manually add news articles through the API.

### Architecture

The **Clean Architecture** principles is used, which divide issues into layers and guarantee that business logic and infrastructure concerns are kept distinct from one another. Principal benefits consist of:

- **Maintainability**: The codebase is easier to maintain and update when there is a clear separation of concerns.
- **Scalability**: The architecture permits the system to expand and change without requiring significant reorganization.
- **Testability**: Comprehensive unit testing is made possible by the isolation of business logic from external dependencies.
- **Adaptability**: Modifications to external frameworks or dependencies little affect the main business logic.

### Object Oriented Designs

Throughout the project's development, the SOLID principles have been followed, which combined help to maintain a clean architectural structure and improve the project's overall quality and maintainability.

## Principals Tools

- Node.js
- npm (Node Package Manager)
- TypeScript
- Express
- Eslint
- Jest
- Docker

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage
