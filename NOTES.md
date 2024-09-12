Backend commands used to create project:

npm init - to initialize node based project
npm -D dep1 - to install necessary devDependencies
npm dep1 - to install necessary dependencies

later on you need to create tsconfig.json file in backend folder
use this command:

npx tsc --init - this will create base tsconfig.json file - which we can use to config tscompiler
to help with dev and transpile ts code to js code 

dev script:

correctly set up for cross-platform use. It ensures that nodemon watches TypeScript files, compiles them, and restarts the server on changes, working well on both Unix-based systems and Windows.

"dev": "cross-env NODE_ENV=development nodemon --watch src --ext ts --exec \"npx tsc && node ./dist/index.js\""

Backend library uses:

Backend Config docs:

.env file is used to api key, tokens and passwords - things which are secret and dont need to commit and 
needs to be ignored - it will automatically load the env variables into process.env by looking from the path
where the nodejs application started - backend - basically it looks in the root directory

Frontend commands used to create project:

npm create vite@latest - Then we need to follow the prompts - we selected - react with ts + swc
swc - is swift compiler - increased speed in build time for ts
npm -D dep1 - to install necessary devDependencies
npm dep1 - to install necessary dependencies
npx tailwindcss init -p - it is used to initialize tailwind config

Frontend library uses:

Frontend Config docs:

in tailwind.config.js

we haved modified and made content - content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

The pattern **/* is a glob pattern commonly used in file path matching to represent all files and directories recursively within a given directory.

Breakdown of **/*:

**/: The ** (double asterisk) matches any number of directories (including zero), regardless of their name. It can traverse through all directories and subdirectories.

*: The single asterisk * matches any sequence of characters within a single directory level, representing all files within that level.

Example Usage:

Given the pattern ./src/**/*, here's what it matches:

./src/index.js: Matches any file directly inside the src directory.
./src/components/Button.js: Matches files inside any subdirectory, such as components in this case.
./src/utils/helpers/index.ts: Matches files deep within nested subdirectories, such as utils/helpers

In src/index.css file:

The @tailwind directives in Tailwind CSS are used to include different layers of Tailwind's styles in your CSS file. These directives are part of how Tailwind CSS structures its utility-first framework, allowing you to control which parts of Tailwind's styles are included in your compiled CSS.

In Layout.tsx:

The LayoutProps interface defines the expected shape of the props object. When you use destructuring in the parameter list, TypeScript infers the type of children directly from the LayoutProps interface. Thus, you don’t need to use LayoutProps.children inside the component because children is already typed correctly by TypeScript.

How authentication works ?

first the users registers with name and password - post api for register endpoint
next the server encrypts the password and stores it in db and generates a jwt token and 
sent back to the browser and for further access to protected routes the token will be used to verify in the serverside and given access accordingly 

Setting auth_token in cookies with httpOnly 

1. httpOnly: true - flags the cookie to be accessible only by the web server.

Then, how can the frontend know that the user is logged in validated or not if we cant read the token
so, for that, we create an endpoint to validate the token and then use the response to show logged in state and the application access in the ui

Improvements or Suggestions:

currently, in the app context we are querying for validate token endpoint but we dont want to query everytime toast state is changed as that is managed in AppContext, we want to validate token only after successful registration will see 

Test commands used to create e2e-tests:

create folder named e2e-tests
cd into that folder
npm init playwright@latest - this will ask questions to select

language to choose - js / ts
where to put end-to-end tests - tests
add a github action workflow
install playwright browsers 
install playwright extensions as well in vscode 

__dirname is a special variable provided by Node.js that helps you manage file paths relative to the module's directory. It is automatically set by Node.js for each module and is useful for constructing file paths and managing file locations in your application.

since, we have moved 