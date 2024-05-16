## TODO

**Tasks**

* **Project Setup**
    * [x] Create a new TypeScript project.
    * [x] User Docker and Docker-compose 
    * [x] Design a suitable file architecture for the project.
* **Model**
    * [x] Define a `User` model with its attributes.
    * [ ] Define a `Feed` model with its attributes.
    * [ ] Choose an ODM (Object Document Mapper) for interacting with MongoDB.
* **API Endpoints**
    * [ ] Create endpoints for operations on the `Feed` model:
        * [ ] Read: Retrieve existing news feeds.
        * [ ] Update: Modify an existing news feed.
        * [ ] Delete: Remove a news feed.
    * [x] Create endpoints for operations on the `User` model:
        * [x] Login: Retrieve existing news feeds.
        * [x] Register: Modify an existing news feed.
    * [x] Create endpoints for operations **Admin** on the `User` model:
    * [x] Decouple API layers for better maintainability.
* **Feed Reading Service**
    * [ ] Develop a service to scrape cover news using web scraping techniques (avoid RSS feeds):
        * [ ] Implement logic to extract news from El País.
        * [ ] Implement logic to extract news from El Mundo.
        * [ ] Design the service for expandability.
* **Documentation & Testing**
    * [ ] Add Postman Collection for examples
    * [x] Create a visual representation of the application architecture (diagram).
    * [ ] Implement unit tests to verify the functionality of different components.
        * [x] User: Usecases and controllers     
    * [ ] Implement unit tests with coverage and threshold
    * [ ] Consider integration tests to ensure API endpoints work as expected.
* **Details**
* [x] Added logger following a format to improve future analysis (For example, fluentBit and grafana)
* **CI & CD**
    * [x] Create workflows to auto test when PR
    * [ ] Auto generate new package



