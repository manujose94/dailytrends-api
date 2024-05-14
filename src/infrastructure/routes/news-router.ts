import express from "express";
import { authenticateToken } from "../middleware/auth-middleware";
import { THttpRequest } from "../../common/types/http-types";

const router = express.Router();

router.get("/feeds", authenticateToken, (req, res) => {
  // Mocked news items
  const news = [
    {
      title: "Breaking News 1",
      content: "Lorem ipsum dolor sit amet, consectet"
    },
    {
      title: "Breaking News 2",
      content: "Sed do eiusmod tempor incididunt ut labore et."
    },
    {
      title: "Breaking News 3",
      content: "Ut laboris nisi ut aliquip ex ea commodo consequat."
    }
  ];
  res.json(news);
});

export default router;
