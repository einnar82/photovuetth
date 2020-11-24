<template>
  <div class="container">
    <div class="columns is-mobile">
      <div class="column">
        <b-select
          name=""
          id=""
          class="custom-select"
          @change="changeCamera"
          v-model="selectedOptions"
          placeholder="Select a name"
        >
          <option
            v-for="option in cameraOptions"
            :value="option.deviceId"
            :key="option.id"
          >
            {{ option.label }}
          </option>
        </b-select>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        <video id="video" width="480" height="480" autoplay></video>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        <b-button type="is-success mr-1" @click="snapImage">
          Capture Image
        </b-button>
        <b-button
          type="is-link"
          tag="a"
          id="link"
          @click="downloadImage"
          :disabled="notCaptured"
        >
          Download
        </b-button>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        <canvas
          id="canvas"
          width="480"
          height="480"
          style="display: none"
        ></canvas>
        <img :src="imageSrc" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    notCaptured: true,
    cameraModel: "",
    selectedOptions: "",
    cameraOptions: [],
    imageSrc: "",
  }),
  computed: {
    fileName() {
      let result = "";
      let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let charactersLength = characters.length;
      for (let i = 0; i < 50; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
  },
  methods: {
    changeCamera(value) {
      let video = document.getElementById("video");
      const updatedConstraints = {
        video: true,
        deviceId: {
          exact: value,
        },
      };
      navigator.mediaDevices
        .getUserMedia(updatedConstraints)
        .then(function (stream) {
          video.srcObject = stream;
          video.play();
        });
    },
    snapImage() {
      let canvas = document.getElementById("canvas");
      let context = canvas.getContext("2d");
      let video = document.getElementById("video");
      // Trigger photo take
      context.drawImage(video, 0, 0);
      this.imageSrc = canvas.toDataURL("image/png");
      this.notCaptured = false;
    },
    downloadImage() {
      let canvas = document.getElementById("canvas");
      let link = document.getElementById("link");
      link.setAttribute("download", `${this.fileName}.png`);
      link.setAttribute("href", canvas.toDataURL("image/png"));
      this.notCaptured = true;
    },
    async initializeDevice() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      this.cameraOptions = videoDevices.map((videoDevice) => {
        return {
          deviceId: videoDevice.deviceId,
          label: videoDevice.label,
        };
      });
      let video = document.getElementById("video");
      // Get access to the camera!
      if (
        "mediaDevices" in navigator &&
        "getUserMedia" in navigator.mediaDevices
      ) {
        this.selectedOptions = this.cameraOptions[0].deviceId;
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            deviceId: {
              exact: this.cameraOptions[0].deviceId,
            },
          })
          .then(function (stream) {
            video.srcObject = stream;
            video.play();
          });
      }
    },
  },
  async mounted() {
    await this.initializeDevice();
  },
};
</script>

<style scoped>
.hide {
  display: none;
}

.show {
  display: block;
}
</style>