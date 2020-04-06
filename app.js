const express = require("express");
const fs = require("fs");
const port = 3000;
const app = express();

function execShellCommand(cmd, param) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      let data = fs.readFileSync(`${param}.pdf`);
      let dataBase = new Buffer.from(data).toString("base64");
      fs.unlinkSync(`${param}.docx`)
      fs.unlinkSync(`${param}.pdf`)
      resolve(dataBase);
    });
  });
}

app.use(express.json());

app.post("/", async (req, res) => {
  let name = Date.now();
  let pdfBase = new Buffer.from(req.body.pdf, "base64");
  fs.writeFileSync(`${name}.docx`, pdfBase);
  const doctoPdf = await execShellCommand(
    `docto -f ${name}.docx -O ${name}.pdf -T wdFormatPDF`,
    name
  );
  

  res.status(200).json({
    success: true,
    pdfBase: doctoPdf
  });
});

app.listen(port, () => {
  console.log("server listen in port", port);
});
