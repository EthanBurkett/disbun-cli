import inq, { QuestionCollection } from "inquirer";
import fs from "node:fs";
import { spawn } from "bun";
import chalk from "chalk";

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

const answers = await inq.prompt(questions);

if (answers.type) {
  if (["Command", "Event"].includes(answers.type)) {
    console.log(
      `${process.cwd()}/src/${answers.type.toLowerCase()}s/${answers.name}.ts`
    );

    const template = fs
      .readFileSync(
        `${__dirname}/template/${answers.type.toLowerCase()}.ts`,
        "utf-8"
      )
      .replace(/{cmd_name}/g, answers.name)
      .replace(/{event_name}/g, answers.name);

    fs.writeFileSync(
      `${process.cwd()}/src/${answers.type.toLowerCase()}s/${answers.name}.ts`,
      template
    );
  }
} else if (answers.path) {
  try {
    fs.mkdirSync(answers.path);
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

    const { stderr } = spawn(["bun", "init", "-y"], {
      cwd: answers.path,
    });

    if (stderr) {
      console.log(stderr);
    }

    spawn(["bun", "add", "disbun"], {
      cwd: answers.path,
    });
  } catch (err) {
    console.log(
      chalk.red`!`,
      chalk.bold`Seems that directory name is already taken..`
    );
  }
}
