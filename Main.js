// 初始化整个游戏的精灵类, 作为游戏的入口
import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {BackGround} from "./js/runtime/BackGround.js";
import {DataStore} from "./js/base/DataStore.js";
import {Director} from "./js/Director.js";
import {Land} from "./js/runtime/Land.js";
import {Birds} from "./js/player/Birds.js";
import {StartButton} from "./js/player/StartButton.js";
import {Score} from "./js/player/Score.js";

export class Main {
    constructor() {
        // this.canvas = document.getElementById('game_canvas');
        this.canvas = wx.createCanvas();
        window.innerWidth = this.canvas.width;
        window.innerHeight = this.canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.dataStore = DataStore.getInstance();
        this.director = Director.getInstance();
        const loader = ResourceLoader.create();
        loader.onLoaded(map => this.onResourceFirstLoaded(map));
    }

    onResourceFirstLoaded(map) {
        // 需要长期保存的变量不用put方法，存储于类变量中
        this.dataStore.ctx = this.ctx;
        this.dataStore.res = map;
        this.init();
    }

    init() {
        // 首先重置游戏是没有结束的
        this.director.isGameOver = false;

        this.dataStore.put('pencils', []).put('background', BackGround).put('land', Land).put('birds', Birds).put('startButton', StartButton).put('score', Score);
        this.registerEvent();
        // 创建要在游戏逻辑开始之前
        this.director.createPencil();
        this.director.run();
    }

    // 注册事件
    registerEvent() {
        this.canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            if (this.director.isGameOver) {
                console.log("游戏开始");
                this.init();
            }else{
                this.director.birdsEvent();
            }
        })
    }
}