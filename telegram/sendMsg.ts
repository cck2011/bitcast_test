import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
    chat_id: "279337376",
    text: "test",
});

axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
    chat_id: "431562273",
    text: "@LTHUNK",
});

axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
    chat_id: "925598150",
    text: "@Stevensososo",
});
