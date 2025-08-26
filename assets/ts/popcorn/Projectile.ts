import {settings as s} from "./settings";
import {DrawFrame} from "../framework25/DrawFrame";
import {iAnimatable} from "../framework25/types/iAnimatable";
import {iFrame} from "../framework25/types/iFrame";
import {Vector} from "../framework25/Vector";
import {randomFloat, randomInt} from "../framework25/helpers/random";

export class Projectile extends DrawFrame implements iAnimatable {
    shouldBeRemoved: boolean = false;
    private canvas: HTMLCanvasElement;
    public hiddenNumber: number;
    public position: Vector;
    private speed: Vector;
    private acceleration: Vector;
    private clock: boolean;


    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, sprite: HTMLImageElement, frame: iFrame, rotation: number, hiddenNumber: number) {
        super(ctx, sprite, frame, rotation);
        this.canvas = canvas;
        this.hiddenNumber = hiddenNumber;
        this.initRandomValues();
        this.clock = Math.random() > 0.5;
    }

    animate() {
        this.speed.add(this.acceleration);
        this.position.add(this.speed);

        if (this.clock) {
            this.rotation += s.projectiles.rotation;
        } else {
            this.rotation -= s.projectiles.rotation;
        }

        this.frame.dx = this.position.x;
        this.frame.dy = this.position.y;

        if (this.frame.dy > this.canvas.height + this.frame.dh){
            this.initRandomValues();
        }

        this.draw();
    }

    private initRandomValues() {
        this.speed = Vector.fromAngle(
            randomFloat(s.projectiles.angle.min, s.projectiles.angle.max),
            randomInt(s.projectiles.magnitude.min, s.projectiles.magnitude.max),
        );

        this.acceleration = new Vector({
            x: 0,
            y: randomFloat(s.projectiles.acceleration.min, s.projectiles.acceleration.max),
        })

        this.position = new Vector({
            x: randomInt(this.frame.dw / 2, this.canvas.width - this.frame.dw / 2),
            y: this.canvas.height,
        });
    }
}