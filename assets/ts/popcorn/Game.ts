// @ts-ignore

import {iGameStatus} from "./types/iGameStatus";
import {settings as s} from "./settings";
import {Animation} from "../framework25/Animation";
import {Projectile} from "./Projectile";
import {Collision} from "../framework25/helpers/Collision";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private sprite: HTMLImageElement;
    private gameStatus: iGameStatus;
    private animation: Animation;
    private score: number = 0;
    private firstCanvasClick: boolean = false;
    private maxTime: number;
    private remainingTime: number;
    private timerId: number;
    private pTimerElt: HTMLParagraphElement;
    private templateElt: HTMLTemplateElement;
    private finalInformationElt: HTMLDivElement;
    private finalScoreElt: HTMLParagraphElement;
    private currentScoreElt: HTMLParagraphElement;
    private restartFormElt: HTMLFormElement;
    private pElement: HTMLParagraphElement;
    private digitElements: [] = [];


    constructor() {
        this.gameStatus = {
            isStarted: false,
        }
        this.canvas = document.getElementById(s.canvas.id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.sprite = new Image();
        this.sprite.src = s.sprite;
        this.animation = new Animation(this.canvas, this.ctx);
        this.maxTime = s.information.maxTime;
        this.remainingTime = this.maxTime;
        this.timerId = null;
        this.pTimerElt = document.querySelector(s.information.timeClassName) as HTMLParagraphElement;
        this.templateElt = document.getElementById(s.information.templateId) as HTMLTemplateElement;
        this.finalInformationElt = document.querySelector(s.information.finalInformation) as HTMLDivElement;
        this.currentScoreElt = document.querySelector(s.information.scoreClassName) as HTMLParagraphElement;
        this.restartFormElt = document.getElementById(s.information.restartForm) as HTMLFormElement;
        this.pElement = document.getElementById('phone-number-digit') as HTMLParagraphElement;
        this.generatePopCorns();
        this.generateCorns();
        this.displayTimer();
        this.displayScore();
        this.phone();
        this.addEventListeners()
    }

    private addEventListeners() {
        this.sprite.addEventListener('load', () => {
            this.animation.start();
        });

        this.canvas.addEventListener('click', e => {

            const correctedX = e.clientX - this.canvas.getBoundingClientRect().x;
            const correctedY = e.clientY - this.canvas.getBoundingClientRect().y;

            if (!this.firstCanvasClick) {
                this.gameStatus.isStarted = true;
                this.firstCanvasClick = true;
                this.startTimer();
            }

            this.animation.iAnimatables.forEach((projectile: Projectile) => {
                if (Collision.isPointInRotatedRectangle(
                    projectile.frame.dw,
                    projectile.frame.dh,
                    projectile.position,
                    projectile.rotation,
                    {
                        x: correctedX,
                        y: correctedY,
                    })) {
                    if (projectile.hiddenNumber < 0) {
                        this.stopGame();
                    } else {
                        if (this.gameStatus.isStarted) {
                            this.score++;
                            this.displayScore();
                        }
                    }
                }
            });
        });

        this.restartFormElt.addEventListener('submit', e => {
            e.preventDefault();
            this.resartGame();
        });
    }

    private generatePopCorns() {
        for (let i = 0; i < s.popcorns.length; i++) {
            this.animation.registeriAnimatable(new Projectile(this.canvas, this.ctx, this.sprite, s.popcorns[i], 0, i));
        }
    }

    private generateCorns() {
        for (let i = 0; i < s.corns.length; i++) {
            this.animation.registeriAnimatable(new Projectile(this.canvas, this.ctx, this.sprite, s.corns[i], 0, -1));
        }
    }

    private startTimer() {
        this.timerId = setInterval(() => {
            this.updateTimer();
        }, 10);
    }

    private updateTimer() {
        this.remainingTime--;
        this.displayTimer();
        if (this.remainingTime === 0) {
            this.stopGame();
        }
    }

    private stopGame() {
        this.animation.stop();
        this.gameStatus.isStarted = false;
        this.displayFinalScore();
        this.stopTimer();
    }

    private displayTimer() {
        this.pTimerElt.textContent = `Temps restant : ${this.remainingTime}`;
    }

    private stopTimer() {
        clearInterval(this.timerId);
    }

    private displayFinalScore() {
        const templateClone = this.templateElt.content.cloneNode();

        this.finalInformationElt.appendChild(templateClone);
        this.finalScoreElt = document.querySelector(s.information.finalScore) as HTMLParagraphElement;

        this.finalInformationElt.textContent = s.information.scoreText(this.score);
    }

    private removeFinalScore() {
        this.finalInformationElt.innerHTML = "";
    }

    private displayScore() {
        this.currentScoreElt.textContent = `Score : ${this.score}`;
    }

    private resartGame() {
        if (this.remainingTime === 0) {
            this.animation.start();
        }

        this.stopTimer();
        this.removeFinalScore();
        this.remainingTime = this.maxTime;
        this.score = 0;
        this.gameStatus.isStarted = false;
        this.firstCanvasClick = false;
        this.animation.resetiAnimatables();

        this.displayScore();
        this.generateCorns();
        this.generatePopCorns();
        this.displayTimer();
        this.phone();
    }

    private phone() {
        this.pElement.innerHTML = "";
        this.pElement.insertAdjacentHTML('beforeend', `<i class="digit test" data-number="0">0</i>`);
        this.digitElements.push(document.querySelector('.digit:last-of-type'));

        for (let i = 0; i < 9; i++) {
            this.pElement.insertAdjacentHTML('beforeend', `<i class="digit">${Math.floor(Math.random() * 9)}</i>`);
            this.digitElements.push(document.querySelector('.digit:last-of-type'));
        }
    }
}