const swaggerAutogen = require("swagger-autogen")()

const doc = {
    info: {
        version: "1.0.0",
        title: "Patrick nsh. (mybrand and blog) API",
        description: "Node.js api for my personal brand website and blog <b>Patrick nsh.</b>"
    },
    host: "https://mybrand-blog-api.herokuapp.com",
    basePath: "/",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            "name": "Auth",
            "description": "Auth endpoints"
        },
        {
            "name": "Posts",
            "description": "Posts endpoints"
        },
        {
            "name": "Messages",
            "description": "queries endpoints"
        }
    ],
    securityDefinitions: {
        Authorization: {
            type: "apiKey",
            name: "Authorization",
            description: "Value: Bearer ",
            in: "header",
            scheme: 'bearer'
        }
    },
    definitions: {
        LoginModel: {
            $email: "example@email.com",
            $password: "Password12",            
        },
        SignupModel: {
            $username: "John Dor",
            $email: "johndoe@mail.com",
            $password: "Password12", 
        },
        PostModel: {
            $title: "lorem ipsum dol enum",
            $content: "lorem ipsum dol enumlorem ipsum dol enum",
        },
        
        CommentModel: {
            $username: "john doe",
            $comment: "That is not bad!!",
        },
        MessageModel: {
            $username: "john doe",
            $email: "johndoe@email.com",
            $message: "That is not bad!!",
        }
    }
};

const outputFile = "./swagger_output.json";
const endpointFiles = ["./app.js"];
// const endpointFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointFiles, doc).then(() => {
    require("./app");
});
