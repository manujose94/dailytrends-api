## TODO

**Tasks**

* **Project Setup**
    * [x] Create a new TypeScript project.
    * [x] User Docker and Docker-compose 
    * [x] Design a suitable file architecture for the project.
* **Model**
    * [x] Define a `User` model with its attributes.
    * [x] Define a `Feed` model with its attributes.
* **API Endpoints**
    * [x] Create endpoints for operations on the `Feed` model:
        * [x] Read: Retrieve existing news feeds.
        * [x] Update: Modify an existing news feed.
        * [x] Delete: Remove a news feed.
    * [x] Create endpoints for operations on the `User` model:
        * [x] Login: Retrieve existing news feeds.
        * [x] Register: Modify an existing news feed.
    * [x] Create endpoints for operations **Admin** on the `User` model:
    * [x] Decouple API layers for better maintainability.
* **Feed Reading Service**
    * [x] Develop a service to scrape cover news using web scraping techniques (avoid RSS feeds):
        * [x] Implement logic to extract news from El País.
        * [x] Implement logic to extract news from El Mundo.
        * [x] Design the service for expandability.
* **Documentation & Testing**
    * [ ] Add Postman Collection for examples
    * [x] Create a visual representation of the application architecture (diagram).
    * [ ] Implement unit tests to verify the functionality of different components.
        * [x] User: Usecases and controllers     
    * [ ] Implement unit tests with coverage and threshold
    * [ ] Consider integration tests to ensure API endpoints work as expected.
    * [x] Swagger OpenApi Documentation
* **Details**
* [x] Added logger following a format to improve future analysis (For example, fluentBit and grafana)
* **CI & CD**
    * [x] Create workflows to auto test when PR
    * [ ] Auto generate new package

* **Improvements**
    * [ ] Formalizing exceptions and Errors for Users and Feeds
    * [ ] Create more tests for better coverage
    * [ ] Unify Feeds and User response through the THttpResponse interface. Currently implemented only in the Users controller.




