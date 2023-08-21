import dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser"
import getTemplateLocalRoute from "./routes/get-template-local"

dotenv.config()

const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/api/get-template-local", getTemplateLocalRoute)

app.get("/api", (_, res) => {
    res.status(200).json({ data: "Welcome 7!" })
})

// app.get("/api/create-template", async (_req, res) => {
//   const data = new HtmlTemplateModel({
//     html_body: HTMLTemplate,
//     variables: [
//       "contact_title",
//       "contact_first_name",
//       "contact_full_name",
//       "company_name",
//       "contact_email",
//       "scan_qr_image",
//     ],
//   });

//   try {
//     const dataToSave = await data.save();
//     res.status(200).json({ success: true, id: dataToSave._id });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.get("/api/get-template/:id", async (req, res) => {
//   const id = req.params.id;
//   const query = req.query;

//   try {
//     const data = await HtmlTemplateModel.findById(id).exec();

//     if (!data) {
//       res.status(400).json({ data: null });
//       return;
//     }

//     const { html_body, variables } = data;

//     let cloned = html_body;

//     if (Boolean(variables.length)) {
//       variables.forEach((variable) => {
//         if (!query[variable]) return;

//         cloned = cloned.replaceAll(`{{${variable}}}`, query[variable]);
//       });
//     }

//     res.status(200).json({ data: cloned });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
