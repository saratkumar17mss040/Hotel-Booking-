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

Backend library used:

multer - Middleware for handling `multipart/form-data`

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

The pattern \*_/_ is a glob pattern commonly used in file path matching to represent all files and directories recursively within a given directory.

Breakdown of \*_/_:

**/: The ** (double asterisk) matches any number of directories (including zero), regardless of their name. It can traverse through all directories and subdirectories.

_: The single asterisk _ matches any sequence of characters within a single directory level, representing all files within that level.

Example Usage:

Given the pattern ./src/\*_/_, here's what it matches:

./src/index.js: Matches any file directly inside the src directory.
./src/components/Button.js: Matches files inside any subdirectory, such as components in this case.
./src/utils/helpers/index.ts: Matches files deep within nested subdirectories, such as utils/helpers

Test commands used to create e2e-tests:

create folder named e2e-tests
cd into that folder
npm init playwright@latest - this will ask questions to select
later on, we use path - from nodejs, so to recognize types. we install and initial ts

npm i typescript -D

This will install ts as devDependency

npx tsc --init

This will initialize ts config

This

language to choose - js / ts
where to put end-to-end tests - tests
add a github action workflow
install playwright browsers
install playwright extensions as well in vscode

Technical notes:

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

\_\_dirname is a special variable provided by Node.js that helps you manage file paths relative to the module's directory. It is automatically set by Node.js for each module and is useful for constructing file paths and managing file locations in your application.

since, we are now serving the frontend files from backend, now frontend and backend will have the same url - generally in production, this is not recommended as everytime we do changes in frontend it needs to install, build and run the server and server takes time to load and serve these files on top of handling api requests.

so, for next project we will keep it in separate urls

under network access in mongodb atlas please add your local computers ip address and also render web service ip address - static outbound ip address.
it will enable access to db from local computer and also from render web service

this will allow all ip address to access it. for dev, you can add it. later on, remove it - 0.0.0.0/0
will remove later - todo

setting up env varible on render, we dont need frontend_url cuz, the server and fronend assets are coming same url only
// import.meta.env.VITE_API_BASE_URL || '' ensures that API_BASE_URL has a fallback value of an empty string if the environment variable is not set.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

we will use cloudinary to upload images. so that, we dont have to manage images ourselves in the server.

enctype="multipart/form-data" is an attribute used in HTML forms when you need to upload files (such as images, documents, etc.) along with the form data. It specifies how the form data should be encoded when submitting it to the server.

When to Use enctype="multipart/form-data"

File Uploads: If your form includes file inputs (e.g., <input type="file">), you must use enctype="multipart/form-data" in the <form> tag. Without this encoding type, the file data won't be properly sent to the server.
How It Works:
When the form is submitted with enctype="multipart/form-data", the form fields are sent as separate parts of a multipart message:

Text fields (like <input type="text">) are sent as regular data.
File inputs (like <input type="file">) are sent as binary data (including the file contents).

Why Use multipart/form-data?

File Uploads: It’s required to send binary data (like files) from the client to the server.
Multiple Data Types: It allows sending a combination of text and binary data (files) within the same request.
Other enctype Values:
application/x-www-form-urlencoded (default): Data is encoded as key-value pairs (used when no file upload is involved).
text/plain: Data is sent as plain text (rarely used).

Yes, it is possible to handle file uploads without using multer, but it requires more manual effort. You would need to handle the multipart/form-data format yourself, which involves parsing the request body, handling file streams, and saving the file. However, this is more complex and error-prone than using a library like multer.

without conversion to base64 we can upload it as buffers, cloudinary can handle it - need to check later on

const uploadPromises = imageFiles.map((image) =>
new Promise<string | null>((resolve, reject) => {
cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
if (error) {
console.error('Upload failed:', error);
resolve(null);
} else {
resolve(result?.secure_url || null);
}
}).end(image.buffer);
})
);

No Error Reporting: Mongoose won’t report errors if there’s a mismatch between TypeScript types and Mongoose schema because TypeScript and Mongoose operate in different phases (compile-time vs. runtime).
To ensure consistency between TypeScript types and Mongoose schemas, you should manually keep them aligned. There are also tools and practices, such as schema validation libraries or code generation tools, that can help synchronize these definitions if needed.

Dont set up serving frontend assets from the server, you can opt-in for that once backend dev is fully done
.Because everytime you change something in server and you use nodemon then nodemon needs to serve the frontend assets as well which will take time. better to keep the ports different and work.

Improvements or Suggestions:

It might have been implemented or not - check the status at the end for each point

currently, in the app context we are querying for validate token endpoint but we dont want to query everytime toast state is changed as that is managed in AppContext, we want to validate token only after successful registration will see - this is done by creating separate login context -
then later on checked even after login - when routing to different page isLoggedIn becomes false - somehow login context was re-rendering.
so, fallback to authors code where he has loggedIn state within app context provider - in his code, he doesnt maintain isLoggedIn - use state
instead he uses isError state for fetching validateToken which is not accurate in this place. no enabled options was also there.
because of this, validate token was getting called in initial render which we dont want. added logged in state and added more config to validate token with local storage, but when we route still the query is somehow getting called no idea. AppContext is getting rendered again. even if it renders, the query should work based on staleTime and cacheTime. - lol

In .gitignore file which is present in root directory, we have added sort of full path to ignore files from both frontend and backend folder. but not needed
Explanation:

In a monorepo setup, you do not need to explicitly specify each folder path (frontend, backend, etc.) when ignoring files in the .gitignore file. Git applies the rules in .gitignore recursively throughout the entire directory tree, starting from the folder where the .gitignore file is located (usually the root of your project).

Here's how it works:
Recursive Matching:

When you write node_modules/ in the root .gitignore, it will automatically ignore any node_modules directory within any subdirectory of the monorepo, whether it’s frontend/node_modules, backend/node_modules, or e2etest/node_modules. This is because Git looks for a node_modules/ directory in every subdirectory of the repository.
Wildcard Patterns:

The same applies to the .env files. By writing .env in the root .gitignore, it will ignore any .env file found in any subdirectory of the project (e.g., frontend/.env, backend/.env, etc.). - this can be applied later on

currently, in the index.ts - server entry file we have config directly can we keep all external services config separately - can be done later on - it is done

for api/my-hotels - root api endpoint some validations are missed out like adultCount, childCount. To ensure data consistency and
integrity we will add it - need to do

currently, we are defining types separately for frontend and backend.
instead, we can have base shared type and then we can extend it based on frontend and backend requirements - we will try this on next project
but it is subjective

have used json-server for mocking api - for better dynamic mocking and more control over mock api - we will use miragejs next time

while rendering any list of items - the author was not adding key prop, which is important - so we will add it with data that it supplied for now. generally, unique ids are added - so next time when modeling data. keep that in mind. - I have added it in bunch of components.

we will also try to use runtime validation lib like yup, joi, zod for the next project

In frontend, we have added this rule:

"no-unused-vars": "warn",
"@typescript-eslint/no-unused-vars": [
"off", // Show as warning
{
vars: "all",
args: "after-used",
argsIgnorePattern: "^_", // Ignore arguments prefixed with "_"
varsIgnorePattern: "^_", // Ignore variables prefixed with "_"
ignoreRestSiblings: true, // Ignore rest siblings in destructuring
},
],

by default since i have eslint as extension, it will give error for unused vars, but made it to show it as warning. since, we also have "@typescript-eslint plugin that also shows as error twice for same vars !. which is not needed.
so, i have set it off.

The test was not working when written like authors code for manage-hotels.spec.ts
so, i am waiting for the api response after clicking the save button and then checking for notification.
it worked finally

refer the code:

// Wait for the specific API call response
const response = await page.waitForResponse((response) => {
return (
response.url().includes("api/my-hotels") &&
(response.status() === 201 || response.status() === 200)
);
});

await expect(page.getByText("Hotel saved !")).toBeVisible();

Here’s a high-level process for implementing cookie-based session management using JWT (JSON Web Token) with a token validation endpoint:

1. User Login and Token Issuance:

Frontend: The user submits login credentials (e.g., username and password) via a POST request to the backend /login endpoint.

Backend:

1. Authenticates the user by validating the credentials.
   If valid, the server generates a JWT, which contains user information (like user ID, role) in its payload.
   The server sends the JWT token in a secure, HTTP-only cookie back to the client (using the Set-Cookie header). This cookie can be flagged as Secure, HttpOnly, and optionally SameSite to prevent XSS and CSRF attacks.

2. Storing the JWT in a Cookie:

Frontend: The browser automatically stores the JWT token in the secure cookie because the server sets it.
Cookie Properties:
HttpOnly: The cookie is not accessible via JavaScript, preventing potential XSS attacks.
Secure: The cookie is only sent over HTTPS.
SameSite: You can set this flag to Strict or Lax to protect against CSRF attacks.

3. Sending the JWT with Future Requests:

Frontend: For every subsequent request (e.g., to a protected API like /profile), the browser automatically sends the JWT cookie back to the backend.
Backend:
Receives the request with the JWT stored in the cookie.
The server extracts the token from the cookie and verifies its validity (e.g., checks signature, expiration).
If the token is valid, the user is authorized to access the protected resource, and the server responds accordingly.

4. Token Validation Endpoint:

Frontend: To ensure the token is still valid, the frontend might occasionally call an endpoint like /validate-token.

Backend: This endpoint:

Extracts the JWT token from the cookie.
Verifies the token using a secret key (usually the same one used to sign the JWT).
Checks for the token’s expiration (JWT typically has an exp field for this).
If the token is valid, it responds with a success status (e.g., 200 OK).
If invalid (e.g., token expired or tampered with), it responds with an error (e.g., 401 Unauthorized).

5. Token Expiration and Refresh:

Frontend: If the JWT is expired or close to expiring, the frontend will need to either prompt the user to log in again or make a request to a refresh token endpoint.

Backend:
Optionally, the server can issue a refresh token (with a longer expiration) when the user logs in. This refresh token can be stored in a secure cookie.
When the frontend detects the JWT is about to expire, it sends the refresh token to an endpoint like /refresh-token.
The server validates the refresh token and issues a new JWT.
The new JWT is set again as an HTTP-only cookie, and the session is extended.

6. Logout Process:

Frontend: When the user logs out, the frontend sends a request to /logout.

Backend:
The server clears the JWT cookie by sending a Set-Cookie header with an expired date (effectively invalidating the session).
Any future requests will not include the JWT, and the user will need to log in again to get a new token.

Summary Flow:

Login → Client sends credentials → Server issues JWT in cookie.
Subsequent Requests → JWT is sent automatically in cookies → Server validates the JWT and responds with protected resources.
Validate Token → Client can hit /validate-token to check if the session is still active.
Refresh Token (Optional) → Client can use refresh tokens to renew JWTs without logging in again.
Logout → Server clears the JWT cookie, ending the session.
Security Considerations:
JWT Expiration: Keep a short expiry for the JWT to minimize risk.
HttpOnly and Secure Cookies: Prevents client-side scripts from accessing the cookie, improving security against XSS.
CSRF: Use SameSite cookies or CSRF tokens to protect against cross-site request forgery.

Multipart Request: By sending the FormData object, the Content-Type is automatically set to multipart/form-data, which is required for file uploads.

Conditionally rendered components are always included in the build, even if they are not rendered initially or based on certain conditions.
The build process compiles all your JavaScript, CSS, and assets into static files (e.g., index.html, .js, .css), which the server then serves.
Tree shaking removes completely unused code, but conditionally rendered components are considered "used" because they are part of the app logic.

Currently, add hotel page is not a protected route - meaning it should be rendered only when user is logged in or else it should be
redirected - currently this is not how it works - it is shown of both logged in and not logged in users. it is just that uploading is allowed only
for logged in users - currenntly i have fixed isLogged protected paths to work like this

const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
sessionStorage.getItem("isLoggedIn") === "true"
);

white-space: pre-line; does:

Newlines (line breaks) in the source code are respected.
Multiple spaces are collapsed into a single space.
Text wrapping occurs when the text reaches the edge of its container.

before using react-query, we need to learn it good enough to start with any project as it involves fetching and dealing with server state.

In the below code, the type name is SearchContextType, but
the author named it as SearchContext similar to const SearchContext name
it seems no issue having type name and var name same as types are used only at compile-time, but for my naming convention i will suffix with Type

type SearchContextType = {
destination: string;
checkIn: Date;
checkOut: Date;
adultCount: number;
childCount: number;
hotelId: string;
saveSearchValues: (
destination: string,
checkIn: Date,
checkOut: Date,
adultCount: number,
childCount: number
) => void;
};

const SearchContext = React.createContext<SearchContextType | undefined>(
undefined
);

You’re not seeing a TypeScript error because TypeScript allows functions returning promises to either resolve (with the expected type) or reject (with an error).
A rejected Promise doesn’t need to match the return type (HotelType[]); it simply carries the error, and this behavior is understood by the type system. Eg: api-client.ts -> fetchMyHotels function

basically, we can see view more hotel details page only when signed in.
if signed in, the button will show - book or sign in to book. but sign-in to book wont work as it is inconsistent, because the on re-rendering the hotel details page the verifyToken will be unauthorized after signing out.



