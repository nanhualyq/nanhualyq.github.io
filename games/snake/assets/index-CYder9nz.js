var y=Object.defineProperty;var L=(a,r,e)=>r in a?y(a,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[r]=e;var d=(a,r,e)=>(L(a,typeof r!="symbol"?r+"":r,e),e);import{p as u}from"./phaser-nD4EcAQo.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(t){if(t.ep)return;t.ep=!0;const i=e(t);fetch(t.href,i)}})();class g extends Phaser.GameObjects.Image{constructor(r,e,s){super(r,0,0,s),this.scene=r,this.setOrigin(0),this.setSize(e,e),this.setDisplaySize(e,e),this.tint=16777215,this.tintFill=!0,r.add.existing(this),r.add.tween({targets:this,props:{alpha:.1},duration:1e3,repeat:-1})}resetPosition(r){const{width:e,height:s}=this.scene.scale,t=this.width,i=new Set;for(let o=0;o<e/t;o++)for(let l=0;l<s/t;l++)i.add(`${o},${l}`);for(const o of r.getNodes())i.delete(`${o.x/t},${o.y/t}`);const n=Phaser.Utils.Array.GetRandom(Array.from(i)),[h,c]=n.split(",");this.setPosition(+h*t,+c*t),r.getNodes().length>1&&(this.tintFill=Math.random()>.1)}}let p=0;class E extends Phaser.GameObjects.Group{constructor(e,s){super(e);d(this,"scene");d(this,"CELL_SIZE");d(this,"direction","RIGHT");this.direction="RIGHT",this.scene=e,this.CELL_SIZE=s,this.append()}append(e=0,s=0){const t=this.scene.add.rectangle(e,s,this.CELL_SIZE,this.CELL_SIZE,16777215).setOrigin(0).setStrokeStyle(1);this.add(t)}getNodes(){return this==null?void 0:this.getChildren()}appendTail(e){var h;const[s,t]=(h=this==null?void 0:this.getNodes())==null?void 0:h.slice(-2);let i=0,n=0;if(t){const c=s.getTopLeft(),o=t.getTopLeft();i=o.x-c.x+o.x,n=o.y-c.y+o.y}else if(s){const c=s.getTopLeft();switch(i=c.x,n=c.y,e){case"UP":n+=this.CELL_SIZE;break;case"DOWN":n-=this.CELL_SIZE;break;case"LEFT":i+=this.CELL_SIZE;break;case"RIGHT":i-=this.CELL_SIZE;break}}this.append(i,n)}moveByDirection(){const e=this.getNodes();for(let t=e.length-1;t>0;t--)e[t].x=e[t-1].x,e[t].y=e[t-1].y;const s=e[0];switch(this.direction){case"UP":s.y-=this.CELL_SIZE;break;case"DOWN":s.y+=this.CELL_SIZE;break;case"LEFT":s.x-=this.CELL_SIZE;break;case"RIGHT":s.x+=this.CELL_SIZE;break}}isGameOver(){const[e,...s]=this.getNodes(),{x:t,y:i}=(e==null?void 0:e.getTopLeft())||{x:0,y:0},{width:n,height:h}=this.scene.scale,c=t<0||i<0||t>n||i>h,o=s.some(l=>l.x===t&&l.y===i);(c||o)&&this.scene.scene.stop("default").start("over",{length:this.getNodes().length})}isEatFood(e){var i,n;const s=e==null?void 0:e.getTopLeft(),t=(n=(i=this.getNodes())==null?void 0:i[0])==null?void 0:n.getTopLeft();(s==null?void 0:s.x)===(t==null?void 0:t.x)&&(s==null?void 0:s.y)===(t==null?void 0:t.y)&&(this.appendTail(this.direction),e==null||e.resetPosition(this))}updateDirection(e){const s=["LEFT","RIGHT"].includes(this.direction);e==="UP"&&s?this.direction="UP":e==="RIGHT"&&!s?this.direction="RIGHT":e==="DOWN"&&s?this.direction="DOWN":e==="LEFT"&&!s&&(this.direction="LEFT")}updateByFrame(e){p++,p===50-this.getNodes().length-1&&(p=0,this.updateDirection(e),this.moveByDirection())}}const f=40;class m extends u.Scene{constructor(){super(...arguments);d(this,"keys");d(this,"snake");d(this,"food");d(this,"nextDirection","")}preload(){this.load.image("avatar","https://avatars.githubusercontent.com/u/6212850?v=4")}create(){var e;this.nextDirection="",this.food=new g(this,f,"avatar"),this.snake=new E(this,f),this.food.resetPosition(this.snake),this.keys=(e=this.input.keyboard)==null?void 0:e.createCursorKeys(),this.input.on("pointerup",s=>{const t=s.x-s.downX,i=s.y-s.downY,n=100;i<-n?this.nextDirection="UP":t>n?this.nextDirection="RIGHT":i>n?this.nextDirection="DOWN":t<-n&&(this.nextDirection="LEFT")})}update(){var e,s,t,i,n,h,c;(e=this.keys)!=null&&e.up.isDown?this.nextDirection="UP":(s=this.keys)!=null&&s.right.isDown?this.nextDirection="RIGHT":(t=this.keys)!=null&&t.down.isDown?this.nextDirection="DOWN":(i=this.keys)!=null&&i.left.isDown&&(this.nextDirection="LEFT"),(n=this.snake)==null||n.isGameOver(),(h=this.snake)==null||h.isEatFood(this.food),(c=this.snake)==null||c.updateByFrame(this.nextDirection)}}class x extends Phaser.Scene{constructor(){super({key:"over"});d(this,"score");this.score=0}init(e){this.score=e.length}create(){var s;this.add.text(0,0,`Game Over!
Your score: ${this.score}`,{fontSize:"4rem"}).setOrigin(.5).setPosition(this.cameras.main.centerX,this.cameras.main.centerY),this.input.on("pointerup",()=>this.startGame()),(s=this.input.keyboard)==null||s.on("keydown",()=>this.startGame())}startGame(){this.scene.stop("over").start("default")}}new u.Game({physics:{},scene:[m,x],scale:{mode:Phaser.Scale.ScaleModes.RESIZE}});
