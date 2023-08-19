import mongoose from "mongoose";

const { Schema } = mongoose;

const htmlTemplateSchema = new Schema({
  html_body: { required: true, type: String },
  variables: [{ type: String }],
  create_at: { type: Date, default: Date.now },
});

const HtmlTemplateModel = mongoose.model("html_templates", htmlTemplateSchema);
export default HtmlTemplateModel;
