import inq, { QuestionCollection } from "inquirer";
const fs = require("fs");
import { exec as spawn } from "node:child_process";
const colors = require("colors");

const command = process.argv[2];

let questions: QuestionCollection = [];

if (!command) {
  questions = [
    {
      type: "input",
      name: "path",
      message: "Where do you want to make the project?",
      default: "my-disbun-project",
    },
  ];
}

switch (command) {
  case "add":
    questions = [
      {
        type: "list",
        name: "type",
        message: "What's the type of the component?",
        choices: ["Command", "Event", "Middleware"],
      },
      {
        type: "input",
        name: "name",
        message: `What's the name of the component?`,
      },
    ];
    break;
}

(async () => {
  const answers = await inq.prompt(questions);

  if (answers.type) {
    if (["Command", "Event"].includes(answers.type)) {
      const template = fs
        .readFileSync(
          `${__dirname}/template/${answers.type.toLowerCase()}.ts`,
          "utf-8"
        )
        .replace(/{cmd_name}/g, answers.name)
        .replace(/{event_name}/g, answers.name);

      fs.writeFileSync(
        `${process.cwd()}/src/${answers.type.toLowerCase()}s/${
          answers.name
        }.ts`,
        template
      );
    }
  } else if (answers.path) {
    try {
      if (!fs.existsSync(answers.path)) {
        fs.mkdirSync(answers.path);
      }
      fs.mkdirSync(`${answers.path}/src`);
      fs.mkdirSync(`${answers.path}/src/commands`);
      fs.mkdirSync(`${answers.path}/src/events`);
      fs.mkdirSync(`${answers.path}/src/middleware`);

      const index = fs.readFileSync(`${__dirname}/template/index.ts`, "utf-8");
      const command = fs.readFileSync(
        `${__dirname}/template/command.ts`,
        "utf-8"
      );

      fs.writeFileSync(`${answers.path}/index.ts`, `// You can delete me :)`);
      fs.writeFileSync(`${answers.path}/src/index.ts`, index);
      fs.writeFileSync(`${answers.path}/src/commands/ping.ts`, command);

      const { stderr } = spawn("bun init -y", {
        cwd: answers.path,
      });

      if (stderr) {
      }

      spawn("bun add disbun", {
        cwd: answers.path,
      });
    } catch (err) {
      console.log(
        colors.red(`!`),
        colors.bold(`Seems that directory name is already taken..`)
      );
    }
  }
})();
