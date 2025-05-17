<!-- 开发者页面 -->
<template>
  <div class="main-container">
    <div class="container">
      <div class="developers">

        <div>
          <my-text content="开发者！" size="large" /><br>
          <my-text content="刘宗熹 任致远 商邑飞 吴童（音序序）" size="medium" />
        </div>
        <div><my-text content="给制作组打钱！" size="large" /></div>
        <div>
          <my-text content="贡献！" size="large" /><br>
          <a
            href="https://github.com/YHStar/8bits-of-rust"
            target="_blank"
            rel="noopener">
            <my-text content="点此贡献更多功能" size="medium" />
          </a>
        </div>
      </div>
      <my-text content="==[￥]==>" size="large" />
      <img src="@/assets/qrcode.jpg" height="400px" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 600px;
  gap: 10px;
  padding: 10px;
}
.developers {
  display: flex;
  flex-direction: column;
  gap: 60px;
}
</style>
