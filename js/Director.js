// 导演类, 控制游戏的逻辑
import {DataStore} from "./base/DataStore.js";
import {UpPencil} from "./runtime/UpPencil.js";
import {DownPencil} from "./runtime/DownPencil.js";

export class Director {
    constructor() {
        this.dataStore = DataStore.getInstance();
        this.moveSpeed = 2;
        this.isGameOver = true;
    }
    static getInstance() {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    // 创建铅笔方法
    createPencil() {
        const minTop = window.innerHeight / 8;
        const maxTop = window.innerHeight / 2;
        const top = minTop + Math.random() * (maxTop - minTop);
        this.dataStore.get('pencils').push(new UpPencil(top));
        this.dataStore.get('pencils').push(new DownPencil(top));
    }

    // 小鸟事件
    birdsEvent() {

        for (let i = 0; i <= 2; i++) {
            this.dataStore.get('birds').y[i] = this.dataStore.get('birds').birdsY[i];
        }

        this.dataStore.get('birds').time = 0;
    }

    // 判断小鸟是否和铅笔撞击
    static isStrike(bird, pencil) {
        let s = false;
        if (bird.top > pencil.bottom || bird.bottom < pencil.top || bird.right < pencil.left || bird.left > pencil.right) {
            s = true;
        }
        return !s;
    }

    // 判断小鸟是否撞到地板和铅笔
    check() {
        const birds = this.dataStore.get('birds');
        const land =  this.dataStore.get('land');
        const pencils = this.dataStore.get('pencils');
        const score = this.dataStore.get('score');

        // 地板撞击判断
        if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
            console.log('撞击地板了');
            this.isGameOver = true;
            return;
        }

        // 小鸟的边框模型
        const birdsBorder = {
            top: birds.y[0],
            bottom: birds.birdsY[0] + birds.birdsHeight[0],
            left: birds.birdsX[0],
            right: birds.birdsX[0] + birds.birdsWidth[0]
        }

        const length = pencils.length;
        for (let i = 0; i < length; i++) {
            const pencil = pencils[i];
            const pencilBorder = {
                top: pencil.y,
                bottom: pencil.y + pencil.height,
                left: pencil.x,
                right: pencil.x + pencil.width
            };

            if(Director.isStrike(birdsBorder, pencilBorder)) {
                console.log('撞到铅笔');
                this.isGameOver = true;
                return;
            }

        }

        // 加分逻辑
        if (birds.birdsX[0] > pencils[0].x + pencils[0].width && score.isScore) {
            score.isScore = false;
            score.scoreNumber++;
        }
    }

    run() {
        this.check();
        if(!this.isGameOver){
            // 渲染背景
            this.dataStore.get('background').draw();

            const pencils = this.dataStore.get('pencils');
            // 铅笔刚好划过屏幕左侧, 销毁那一组铅笔
            if (pencils[0].x + pencils[0].width <= 0 && pencils.length === 4) {
                pencils.shift();
                pencils.shift();
                this.dataStore.get('score').isScore = true;
            }

            // 当第一级消失，只剩一组时，渲染第二组铅笔（等距渲染）
            if (pencils[0].x <= (window.innerWidth - pencils[0].width) / 2 && pencils.length === 2) {
                this.createPencil();
            }

            // 渲染一组铅笔
            this.dataStore.get("pencils").forEach(function (value){
                value.draw();
            })

            // 渲染地板
            this.dataStore.get('land').draw();
            // 渲染分数
            this.dataStore.get('score').draw();
            // 渲染小鸟
            this.dataStore.get('birds').draw();

            let timer = requestAnimationFrame(() => this.run());
            this.dataStore.put('timer', timer);
        }else{
            console.log("游戏结束")
            this.dataStore.get('startButton').draw();
            // cancelAnimationFrame(this.dataStore.get('timer'));
            // this.dataStore.destroy();
        }
    }
}