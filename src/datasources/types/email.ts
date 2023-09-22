import { GSContext, GSDataSource, PlainObject } from "@godspeedsystems/core";
import nodemailer from 'nodemailer';

export default class mailDataSource extends GSDataSource {
  protected async initClient(): Promise<PlainObject> {
    return nodemailer;
  }
  async execute(ctx: GSContext, args: PlainObject): Promise<any> {
    try {
      const {from, to, subject, text, meta: { fnNameInWorkflow }} = args;
      let method = fnNameInWorkflow.split(".")[2];
      if (this.client) {
        if(method == "send"){
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: this.config.user,
              pass: this.config.pass // Use the App Password you generated
            }
          });
          const mailOptions = {
            from,
            to,
            subject,
            text
          };
          
          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else{
              console.log(info.response);
            }
          });
        }else{
          return 'Invalid method'
        }  
      }
    } catch (error) {
      throw error;
    }
  }
}