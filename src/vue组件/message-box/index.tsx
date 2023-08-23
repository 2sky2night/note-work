import { Component, createApp } from "vue";
import "./index.css";
import { styled } from "@styils/vue";

// 配置了样式的组件元素
// 消息容器
const BoxContainer = styled("div", {
  backgroundColor: "#fff",
  borderRadius: "5px",
  height: "150px",
  width: "80%",
  maxWidth: "500px",
  padding: "10px",
  boxSizing: "border-box",
});
// 按钮
const ConfirmButton = styled("button", {
  border: "none",
  padding: "5px 10px",
  backgroundColor: "skyblue",
  color: "#fff",
  cursor:'pointer'
});

// 组件配置项
const MessageBox: Component = {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    onHandleClick() {
      this.$emit("toClose");
    },
  },
  emits: ["toClose"],
  render(ctx: any) {
    return (
      <BoxContainer>
        <div class="content">{ctx.title}</div>
        <ConfirmButton onClick={ctx.onHandleClick}>确认</ConfirmButton>
      </BoxContainer>
    );
  },
};

export default function (title: string) {
  const container = document.createElement("div");
  container.classList.add("message_box_mask_container");
  const app = createApp(MessageBox, {
    title,
    onToClose: () => {
      app.unmount();
      container.remove();
    },
  });
  app.mount(container);
  document.body.appendChild(container);
}
