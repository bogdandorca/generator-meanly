## MEANly

Meanly is a Yeoman generator for creating MEAN stack applications, using AngularJS, MongoDB, Express and Node.

You can read more about this application and the API on our [wiki page](https://github.com/bogdandorca/generator-meanly/wiki).

* [Home](https://github.com/bogdandorca/generator-meanly/wiki)
* [Project](https://github.com/bogdandorca/generator-meanly/wiki/Project-Build)

## How to

### Use the generator

In order to run the generator, you'll need:
 1. Node - [Download](https://nodejs.org)
 2. yo - *npm install -g yo*
 3. bower - *npm install -g bower*
 4. obviously, this generator - *npm install -g generator-meanly*
<br /><br />
How to run the generator:
 1. Navigate to the folder where you wish to generate the application
 2. Run **yo meanly**
 3. You will get a number of questions about which elements your wish to generate
 4. After you answer the questions, the project structure will be generated and the dependencies installed

### Run the project

In order to run the generated application you'll need:
 1. Node ~v4.0.0 - [Download](https://nodejs.org)
 2. Gulp - *npm install -g gulp*
 3. MongoDB - [Download](https://mongodb.org)
<br /><br />
How to run the application?
 1. Install the dependencies mentioned above
 2. Make sure the MongoDB server is running
 3. Get the project files
 4. Run **gulp** in your console
 5. The port on which the application is running will be displayed in the console

More information about the *gulp* file and the *tasks* associated can be found on our [wiki](https://github.com/bogdandorca/generator-meanly/wiki/Project)

## Supported Configurations:

Client:
 - Scripts: JavaScript
 - Markup: HTML
 - Stiling: CSS, Sass(with or without Scss), Less
 - Optional: PostCSS

Server:
 - Database: MongoDB

## Project Structure

#### MVC Structure

```
├── gulp_tasks              - Gulp task functions, split by functionality: styles.js, server.js, etc.
│
├── public
│   ├── app                 - All of our app specific components go in here
│   │     ├── controllers   - The application specific Angular Controllers
│   │     │
│   │     ├── directives    - The application specific Angular Directives
│   │     │
│   │     ├── services      - The application specific Angular Services and Factories
│   │     │
│   │     └── filters       - The application specific Angular Filters
│   │
│   ├── assets              - Custom assets: styles, images
│   │    ├── images         - Project related images
│   │    └── styles         - Style collection for the project
│   ├── template            - Template components: layout, header, footer, etc.
│   │
│   ├── partials            - Partials
│   │
│   └── vendor              - Vendor components: Bower installs
│
│
└── server
    ├── config              - Environment configuration folder
    │
    ├── controllers         - Server controllers
    │
    ├── models              - Server models (mongoose schemas, object models)
    │
    └── views               - Server rendered views
```

#### Modular Structure
```
├── gulp_tasks              - Gulp task functions, split by functionality: styles.js, server.js, etc.
│
├── public
│   ├── app                 - All of our app specific components go in here
│   │     └── Home          - Client application module that contains the controller, 
│   │                         services and all the other elements specific to this module
│   │
│   ├── assets              - Custom assets: styles, images
│   │    ├── images         - Project related images
│   │    └── styles         - Style collection for the project
│   ├── template            - Template components: layout, header, footer, etc.
│   │
│   ├── partials            - Partials
│   │
│   └── vendor              - Vendor components: Bower installs
│
│
└── server
    ├── config              - Environment configuration folder
    │
    └── Public              - Client application module that contains the controller, models and all the other elements specific to this module
```


## Version 0.4.0 (Alpha)

As this generator is currently in Alpha stage, it is not recommended for it's use for a stable system.

It is encouraged to contribute with ideas and solutions.
