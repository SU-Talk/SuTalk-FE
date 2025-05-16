import { io } from "socket.io-client";

// 서버 주소를 정확히 입력
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: false, // 필요시 자동 연결 비활성화
});

export default socket;
