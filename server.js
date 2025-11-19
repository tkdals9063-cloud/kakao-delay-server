const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const KAKAO_BOT_TOKEN = "YOUR_KAKAO_SKILL_KEY";

// 30분 = 1800초
const DELAY = 1800 * 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.post("/delay", async (req, res) => {
  console.log("딜레이 스킬 요청 들어옴");

  const userKey = req.body.userRequest.user.id;
  const workType = req.body.action.params.workType;

  // 먼저 바로 OK 응답하기 (오픈빌더에서 에러 안 뜨게)
  res.json({
    version: "2.0",
    resultCode: "OK",
    output: {}
  });

  // 30분 대기
  await sleep(DELAY);

  // workType에 따라 다른 메시지 전송
  let message = "";

  if (workType === "sit") {
    message =
      "💺 오래 앉아계셨네요!\n\n" +
      "30초 정도면 할 수 있는 간단한 동작 추천해드릴게요 😊\n\n" +
      "1) 고관절 신전 스트레칭\n" +
      "2) 흉추 열기 스트레칭\n" +
      "3) 목 앞쪽 늘려주기\n\n" +
      "지금 바로 한 번 해보세요!";
  } else if (workType === "stand") {
    message =
      "🚶 오래 서 있으면 뒷다리가 많이 굳어요!\n\n" +
      "지금 바로 20초 스트레칭 추천드립니다 ☑\n\n" +
      "1) 고관절 굴곡 운동\n" +
      "2) 스탠딩 햄스트링 스트레칭\n" +
      "3) 발목 회전";
  } else {
    message = "30분 동안 근무 중이시네요! 스트레칭 한번 해볼까요?";
  }

  // 메시지 카톡으로 전송
  await axios({
    method: "post",
    url: "https://kapi.kakao.com/v2/bot/message/send",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `KakaoAK ${KAKAO_BOT_TOKEN}`
    },
    data: {
      user_key: userKey,
      template_object: {
        object_type: "text",
        text: message,
        link: { web_url: "https://kakao.com" }
      }
    }
  });

  console.log("30분 후 메시지 전송 완료");
});

app.listen(3000, () => console.log("서버 실행됨 (포트 3000)"));
