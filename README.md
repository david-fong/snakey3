
# ⌨🐍 SnaKey

[**`Try it!` 👈**](https://david-fong.github.io/SnaKey-NTS/)

> I want you- just for a moment- to think back to your most challenging learning experience- a time you stepped into waters that you were completely unfamiliar with: Maybe it was to learn a sport, an instrument, a language, or how to cook something. I think we can all agree that learning is hard. And that's what makes the process of doing it frustrating. I can vouch for that by this entire project. But I can also say from other past experiences that the difficulty in tackling something new and unfamiliar is what makes its eventual fruit so sweet to enjoy.
>
> If I want to get across one message through this project, it is to _be kind to beginners_- whether that is to another person or to yourself. When I get frustrated learning something, I find myself needing to mentally recite that _"I'm not stupid- I'm just learning"_.
>
> People only get good at things by perseverance. I think it's good to remember that for ourselves. Just think how a simple spin on any professional's activity can throw them out of the benefit of their finely tuned habits: Flip a musician's instrument, or a driver's steering, or your own keyboard layout. The massive dexterity gap between our dominant and non-dominant hands is a daily testament of how far a journey of learning can take us.
>
> Learning is difficult. It just is. But we overcome it.

TODO.doc: insert a gif of the gameplay here.

At its core, SnaKey is a typing game where you move around by typing keyboard sequences corresponding to characters from written languages. For example, playing with English, if there was a tile adjacent to your player character marked by the written character "a", to move on it, you would type the keyboard sequence "a". If you were playing with Japanese Hiragana, you would type the keyboard sequence "no" to move onto an adjacent tile marked by the written character "の". It's easier done than said.

SnaKey drew some initial inspiration from the well-known [Snake Game](https://wikipedia.org/wiki/Snake_(video_game_genre)), hence its name, which is a pun on the words "snake" and "keyboard".

## Contents

- [Contents](#contents "Legends say they are still clicking to this very day.")
- [My Goals and Why I do This](#my-goals-and-why-i-do-this)
- [Looking Back and Looking Forward](#-looking-back-and-looking-forward)
  - [Version #1 - Born on a Python](#-version-1---born-on-a-python)
  - [Version #2 - Slithering to the Web](#-version-2---slithering-to-the-web)
  - [Version #3 - Snakes With Wings](#-version-3---snakes-with-wings-you-are-here)
- [Design Challenges](#-design-challenges)
- [Stepping Up my Game](#-stepping-up-my-game "pun intended")
- [My Joys in JavaScript and TypeScript](#my-joys-in-javascript-and-typescript)
  - [Bundling Constructor Arguments as Objects](#-bundling-constructor-arguments-as-objects)
  - [Type Aliases and Declaration Merging](#-type-aliases-and-declaration-merging)
- [Language Representation](#language-representation)

---

## My Goals and Why I do This

|      |                      |
|:----:|----------------------|
| 💡<br>I Love my Idea | And I champion it with the pride of a person whose eyes have never seen it done before. It may not have fallen out of the sky and hit me in the head, [but it kind of feels that way](https://www.ted.com/talks/ok_go_how_to_find_a_wonderful_idea). I strive to develop it and polish it into something that brings out the aspects of challenge and hidden fun from the process of learning something new. |
| 🍏<br>To Push Myself | To make my idea a reality, I need to learn new things: to search for _what_ I need to learn next, to learn about existing choices of tools and how to choose one, and then to learn the tool. First it was Python, and then vanilla web-development, and now, NodeJS, expressJS, SocketIO, VSCode, Typescript, esLint, and WebPack. It's a refreshing change compared to my experience learning in school: Here, I start with a concrete goal in mind, and the goal was given to me from myself. |
| 💼<br>For the Portfolio | I aim to make something polished. That includes coding style and design, documentation, modularity, and compilation. I set out and bind myself to write readmes that share the interesting things that I learn and create. For all I know, my eyes may be the only ones that see these efforts, but to me it is like keeping a house clean so it's always ready for guests: Whether or not guests ever come, a clean house makes for a good house to live in. |

---

## 🚋 Looking Back and Looking Forward

This is a non-technical section to reflect on my previous work on this project.

### 🐍 Version #1 - Born on a Python

<img src="assets/images/screenshots/snakey_version1.png" align="left" width="300" />

I wrote [**version one**](https://github.com/david-fong/SnaKey) of this game in one week of the February of 2019 using Python. I had just finished [learning it](https://github.com/david-fong/Tetris), and I wanted to use it for something original.

I designed the game by asking myself the question _"How can I make it fun for a single player to keep moving around?"_. As the main objective, I randomly spawned apples to collect for score points. To add a sense of ramping pressure, I made an enemy chaser, for competition, an enemy apple collector, and for an extra challenge and reward, an avoider that grants a bonus whenever caught.

The inspiration to add different languages came by taking a beginners' class in Japanese. I really enjoyed it- for interest in the content, and because the professor was a kind person, and a good teacher. That positive learning experience has continued to guide my vision for this game.

### 🕸 Version #2 - Slithering to the Web

<img src="assets/images/screenshots/snakey_version2_hiragana.png" align="left" width="300" />

I excitedly showed version one to my friends and Japanese prof, who responded with enthusiasm and encouragement, and confirmed my fears of poor accessibility. For that reason, over the next month, I learned how to build simple web-pages to port the game to [**version two**](https://github.com/david-fong/SnaKey-JS).

I wrote everything (with hands tied behind my back on NotePad++) in vanilla HTML, Javascript, and CSS. This helped me to build a strong foundation and appreciate the value of a good IDE, strong typing, and style conventions (which pushed me to VsCode, TypeScript, and EsLint in version 3).

The game's objectives, mechanics, and representation went largely unchanged. Being back at square one, most of my efforts went to searching through and exploring documentation on javascript's basic data structures, the browser DOM, and CSS. I found [w3c schools](https://www.w3schools.com/) and the [MDN web docs](https://developer.mozilla.org/en-US/) to be great learning resources.

### 🌐 Version #3 - Snakes With Wings (You are Here)

<img src="assets/images/screenshots/snakey_version3_blank.png" align="left" width="300" />

This brings us to where we are now: November of 2019 and onward. The goal for this version is to implement internet-enabled multiplayer. Although I had recently gotten comfortable [working in a terminal environment](https://github.com/david-fong/Darcy), I decided to try VSCode for the first time, and have absolutely not regretted it.

You might think that after making this game twice I'd be tired of it... but that couldn't be further from the truth! I see so many opportunities to improve on my previous work- to make it more accessible, organized, and more fun. I can't wait for the day when I can sit down and play it with a group of friends, or perhaps even with complete strangers.

---

## 🛩 Design Challenges

See [dedicated readme](./src/).

## 🧗‍♀️ Stepping Up my Game

Now that we understand why the design requires so much more care in this version, we can talk about the solving the problems plaguing the two earlier versions.

|        Topic        | The What and Why of the Problem | The Solution and its Necessity |
|:-------------------:|---------------------------------|--------------------------------|
| 📁<br>Modularity    | | I set out on a quest to optimize compilation time. But after a week of reading [project reference](https://www.typescriptlang.org/docs/handbook/project-references.html) docs, moving folders, and breaking circular references, compilation became \~5% _slower_. Following shock and acceptance, I found a new source of content: as I incrementally increased the granularity of modules, the folder structure became more opinionated _toward_ intuition. My project became much neater. |
| 🦆<br>Inheritance   | | |
| 📄<br>Documentation | This was a problem of values rather than knowledge: At the time, writing documentation didn't feel important since the code was small, and I was using NotePad++ (ie. no mouseover doc peeking). | The new requirements introduce new complexities, and with them, a more critical need to clearly communicate my code's purposes. I thought the solution would be to forcefully document [_everything_](http://s3.ryanparman.com.s3.amazonaws.com/rage/document_all_the_things.png), but to my surprise, I found that for the same goal, it made a greater impact to doggedly write better code (see next section). |

---

## My Joys in JavaScript and TypeScript

In my experience with Java from Co-op, school, and [my own projects](https://github.com/david-fong/UbcCourseSchedulingTool), I grew to love it for its mature specs, strong typing system, and the resulting ability for IDE's to improve the developer experience. That's why as I started breaking into TypeScript in this project, my heart felt like it was flying. Here, I want to share ways that I've been using Javascript and TypeScript to make my code more flexible, organized, and better documented.

### 🍱 Bundling Constructor Arguments as Objects

This is something that can be done in plain Javascript. It serves three purposes:

|       |               |
|:-----:|---------------|
| Footprint Reduction | Nullifies problems with function signature bloat. Defining the shapes of objects and instantiating them is much less verbose in JavaScript than in Java, which makes it convenient and highly practical. |
| Flexible Refactoring | Makes function signatures incredibly malleable. For me, the positive impacts with constructors have been huge. To add, remove, or change the type of an argument, I can modify the type definition and the relevant handler code, and leave all other overrides and call-sites untouched. |
| Named Parameters | Makes it _very_ difficult to pass arguments in "the wrong order" since order is meaningless. All the cognitive effort is migrated to using good names for variable and object-fields, which is more intuitive and robust. |

### 🧩 Type Aliases and Declaration Merging

I have found aliasing primitives to be incredibly useful. A prime example is this project's Player.Id type: It allows me to document a use-case-specific primitive so I can get mouseover documentation anywhere it is used, and around January, it made what might have been an incredibly laborious refactoring task _almost easy_ when I changed that definition to be of object-type.

Using TypeScript's declaration merging feature, type declarations can be namespaced: Instead of writing `export type PlayerId` in the global namespace, which pollutes the global type-declaration group and adds to visual clutter with module imports, I can write something like this (an older example):

```typescript
// <documentation>
export class Player {
    idNumber: Player.Id;
    <...>
}
export namespace Player {
    // <documentation>
    export type Id = number;
    export namespace Id {
        // <documentation>
        export const NULL = 0;
    }
}
```

In Java, you can't alias primitive types, [and that's final 🥁](https://stackoverflow.com/a/28238107/11107541). In C, you can alias anything, but you can only namespace them in C++ and there's no declaration merging!. The ability to do all this in TypeScript sparks me a lot of joy.

---

## Language Representation

[See dedicated readme](src/base/lang/readme.md)
