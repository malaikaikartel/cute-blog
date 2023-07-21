const articles = [
  {
    name: 'about',
    title: 'Cuteblog React',
    date: '22 april 2022',
    desc: 'about cute blog for react js',
    author: 'axcora',
    authorlink: 'https://website.axcora.com',
    img: 'https://cdn.dribbble.com/users/77598/screenshots/5919494/dribbble.png',
    content: [
      `Cuteblog for react is designed specially for react js, so with this source code project or free template themes for react make you fast and easy to build modern blogging website using react js and cuteblog.`,
      `Super fast and of course we have injection with auto generated SEO for this project, yes.. we use helmet !!`,
      `With this concept so you can just focusing on your content article .`,
      `Cuteblog react adalah sebuah tema dan template yang khusus diperuntukan untuk library react js, dan dengan tema ini tentunya harapan kami selaku pengembang memudahkan mu untuk membuat webiste dan blog dengan cepat. `,
      `Persembahan dari axcora technology untuk dunia agar dapat membuat sebuah website dan blog modern berbasis react dengan konsep blog.`,
    ],
  },
  {
    name: 'gatsby-js',
    title: 'Gatsby JS',
    desc: 'Cuteblog for Gatsby with react JS',
    date: '20 april 2022',
    author: 'axcora',
    authorlink: 'https://website.axcora.com',
    img: 'https://media.istockphoto.com/vectors/business-communication-internet-blogging-post-flat-design-vector-vector-id1143088863?k=20&m=1143088863&s=612x612&w=0&h=kJgOoz9QAhbT83Acyhm9whRtxt2j7J7VzWAxCHuEa8o=',
    content: [
      `If you love gatsby js so stay tuned.. next we develope cuteblog to using gatsby js, of course same concept and design with cuteblog.`,
      `Dan ya bagi kamu pencinta gatsby js maka tunggu project kami selanjutnya untuk cuteblog themes template menggunakan gatsby, dan pastinya gratis untuk kamu unduh full source code free download.

---
title: "Building a serverless SaaS product"
description: "A full-stack SaaS project with authentication and payments."
date: "2021-07-12"
---

The [SaaS (software as a service)](https://en.wikipedia.org/wiki/Software_as_a_service) model underpins many of today's successful new businesses. Knowing how to build one from start to finish is probably a useful addition to any software developer's skill set.

But even when you strip a SaaS product of its business logic, there's still a non-trivial amount of work and trade-offs to consider.

In this project, my goal was to build a fully serverless SaaS web-app with authentication and payments — the two vital organs of any business.

My implementation is opinionated (as you'll see), and intended to serve as a starting point for new SaaS ideas in the future. Here's what's included:

- [Authentication](#authentication)
- [Payments (Stripe)](#payments-stripe)
- [Frontend (React)](#frontend-react)
- [Backend API](#backend-api)
- [Serverless architecture](#serverless-architecture)
- [Infrastructure as code](#infrastructure-as-code)
- [CRUD operations](#crud-operations)
- [Lessons Learnt](#lessons-learnt)

You can view the example at https://saas-starter-stack.com/app/ and the source on [GitHub](https://github.com/pixegami/saas-starter). In this post, I'll be reflecting on my choices and experience for each of the above features.

### Authentication

**Don't roll your own auth!** It's hard, and mistakes can be devastating to a business. With that said, I did it anyway — mostly to learn from it. Here's also some [discussion on Hackernews](https://news.ycombinator.com/item?id=22001918) on why you might want to build your own auth.

I used [bcrypt](https://codahale.com/how-to-safely-store-a-password/) and [JSON Web Tokens](https://jwt.io/), and stored credentials on DynamoDB. That part wasn't so bad. The real grind came from building things like exponential back-offs for failed attempts, account verification and reset mechanisms, and patching all the security edge cases.

I got it to a roughly working state, and then called it a day. If this was a production system, I'd probably look into something like [Cognito](https://aws.amazon.com/cognito/), [Firebase](https://firebase.google.com/products/auth) or [Okta](https://www.okta.com/).

### Payments (Stripe)

From payments integration, [Stripe](https://stripe.com) was an easy choice. No prominent alternative come to mind, and I've heard high praises about Stripe's developer onboarding experience.

I set up [subscription payment](https://stripe.com/en-au/billing) integration with the project, and I think the developer experience lives up to expectations. The tutorials were well structured and concise.

But the little thing that impressed me the most was when I typed in 'test card' in a [search box](https://stripe.com/docs/testing), it actually just straight up gave me a card-number I could copy straight to my clipboard. Whoever thought of that just saved me a click, and I'm grateful.

### Frontend (React)

The frontend is a responsive web-app build with [React](https://reactjs.org/). It seems like React is still the dominant technology is the area, although I've yet to try its main competitors like [Vue](https://vuejs.org/) or [Svelte](https://svelte.dev/).

I used [TailWindCSS](https://tailwindcss.com/) for styling, and prefer to anything I've tried in the past (Boostrap CSS, Semantic UI and just vanilla CSS).

I then used [Gatsby](https://www.gatsbyjs.com/) to optimize the static site rendering — but I'm not sure if the extra steps are worth it at this stage. It's better for SEO and performance, but costs extra development cycles.

Overall though, I was quite satisfied with this stack for the frontend, and would be happy to use it for production.

### Backend API

The backend is a serverless REST API implemented in Python and hosted as [Lambda functions](https://aws.amazon.com/lambda/) behind API Gateway.

My main challenge here was to abstract away the lower level things (like CORS, HTTP response formatting, database access) as much as possible. I did this via [Lambda layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html), which allowed me to group a bunch of Python packages and common scripts together.

This allowed me to implement handlers that are quite short and readable, which is think is key to maintainability.

### Serverless architecture

Why serverless? I think for a lot of businesses it simply wins out from a cost and scaling perspective. I could probably serve north of 500k API requests for [less than a dollar](https://aws.amazon.com/lambda/pricing/).

However, this implies that the choice of database must be serverless as well. I chose [DynamoDB](https://aws.amazon.com/dynamodb/) just for the ease of integration. But if I had different data modeling requires (for which the DynamoDB architecture might be unfit), I might look into [Aurora](https://aws.amazon.com/rds/aurora/) or [Fauna](https://fauna.com/).

### Infrastructure as code

Configuring infrastructure is time-consuming and error prone. If I want to be able to deploy a copy of this service quickly, I'd have to [model it as code (IaC)](https://en.wikipedia.org/wiki/Infrastructure_as_code). In keeping theme with my AWS integration so far, I've modeled this project with [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) in Typescript.

With this the entire frontend and backend can be deployed to a brand new account or domain in less than 30 minutes with just a [few configuration changes](https://github.com/pixegami/saas-starter/blob/master/saas-infrastructure/service.config.json).

### CRUD operations

Finally, I've added some simple Twitter-like posting capabilities to the project just as a stub for the actual business logic. It has ways to interact with the authentication API, and find out whether a user is verified, and if they are a paying subscriber.

## Closing Thoughts

Honestly, I'm so tired of this project already. It was a lot more complex than I expected — especially for an app that really doesn't do _anything_! But I did learn a lot along the way though, and will probably be faster the second time around.

My top three takeaways are:

- Don't build your own auth.
- You'll probably rebuild the project at least once or twice, so design things to be flexible.
- Having integration tests really paid off.


`,
    ],
  },
  {
    name: 'installation',
    title: 'Install',
    date: '20 april 2022',
    author: 'axcora',
    authorlink: 'https://website.axcora.com',
    img: 'https://thumbs.dreamstime.com/b/flat-design-business-process-workflow-management-communicating-ready-to-animation-characters-compouse-your-scenes-office-work-128992317.jpg',
    desc: 'How to install cuteblog react ',
    content: [
      `Oke now how to install this cuteblog  project ?? for first make sure you have installing node on your devices, or you can download and install node first, after this we need to download source code project and code editor too... so for code editor you can download visual code studio and install on your device.`,
      `Oke after installation you need to download cuteblog react source code on or github repo, just github icon click button on navbar. or you can using git bash with run git clone https://github.com/mesinkasir/cuteblogreact.git `,
      `Now extract all source code project and you need to install with run npm install && npm start , then open localhost:3000 , congratulation now you have success installing cuteblog for react on your devices. `,
    ],
  },
  {
    name: 'work',
    title: 'Work',
    date: '20 april 2022',
    author: 'axcora',
    authorlink: 'https://website.axcora.com',
    img: 'https://img.freepik.com/free-vector/happy-freelancer-with-computer-home-young-man-sitting-armchair-using-laptop-chatting-online-smiling-vector-illustration-distance-work-online-learning-freelance_74855-8401.jpg?w=2000',
    desc: 'How to work with cuteblog react',
    content: [
      `Oke after you have successfully installed and run on your devices, now you can open source code project using visual code studio, then you can open on src folder , and select ArticleContent.js files - open and edit this files then change with you needed, just follow stucture files for create new article content, and save it for update data.`,
      `For SEO you can visit on index.js file and change title description and other on helmet .`,
    ],
  },
  {
    name: 'deploy',
    title: 'Deploy',
    date: '19 april 2022',
    author: 'axcora',
    authorlink: 'https://website.axcora.com',
    img: 'https://img.freepik.com/free-vector/people-putting-puzzle-pieces-together_52683-28610.jpg?w=2000',
    desc: 'How to deploy on static hosting or shared cloud hosting',
    content: [
      `Oke after change and finishin your project , now you need to cloud your source code right, this is for online your website and blog, so for first you can use two option using firebase and surge or use netlify , vercel, heroku etc.`,
      `For using firebase and surge for first you need to build to production mode, so you can input this command on shell terminal npm run build - then you can deploy on public folder to firebase or surge .`,
      `Option two you can use github intergation with heroku,vercel,netlify - just create account and create new repo and push your source code to your repo project, and you need to integration with netlify ,heroku or vercel, just create new project then select your github repo and deploy it. `,
    ],
  },
  {
    name: 'alternative',
    title: 'Alternative',
    date: '18 april 2022',
    author: 'axcora',
    authorlink: 'https://website.axcora.com',
    img: 'https://appedology.pk/wp-content/uploads/2020/11/6be369b11b50e0b1c3a2fea19ba7e2ba.png',
    desc: 'Use static site generator with cuteblog',
    content: [
      `If you need to build and develope cuteblog project with static site generator , of course you can do it... we have develope cuteblog for jekyll, eleventy 11ty and astro, just visit on our github repo and search cuteblog with generator static site download it then run and deploy on hosting.`,
      `You can visit on our blog for download all source code project, just visit on https://www.hockeycomputindo.com/2010/12/blog-post.html`,
      `Cuteblog for jekyll`,
      `https://www.hockeycomputindo.com/2022/04/auto-seo-dengan-cuteblog-for-jekyll.html`,
      `Cuteblog for eleventy`,
      `https://www.hockeycomputindo.com/2022/04/cuteblog-11ty-for-eleventy-generator.html`,
      `Cuteblog for astro`,
      `https://www.hockeycomputindo.com/2022/04/cute-blog-astro-generator-static-site.html`,
      `Cuteblog for pico cms`,
      `https://www.hockeycomputindo.com/2022/04/tema-blog-website-terbaru-dan-gratis.html`,
    ],
  },
  {
    name: 'cms',
    title: 'Cuteblog CMS',
    date: '18 april 2022',
    author: 'axcora',
    authorlink: 'https://website.axcora.com',
    img: 'https://img.freepik.com/free-vector/group-people-working-together_52683-28615.jpg?w=2000',
    desc: 'If you need build cuteblog with backend admin area so use cuteblog webapp',
    content: [
      `And if you need to work with admin area of course you can do it, yeah.. we have develope cuteblog for content management system to.. so with this cms you can easy for install and deploy or run on your shared cloud hosting, yes.. we have develope using php lang, so you can easy for deploy on your cloud shared hosting.`,
      `Cuteblog pico cms, yes.. we have develope using pico cms, so why use pico ?? of course with pico is very secure and fast , this way why we chose pico, just download and upload it on your hosting then your webiste is live, and you can work with admin area too.. so if you need work using pico cms so download now just visit this link https://axcora.my.id/pico/cuteblog .`,
      `Cuteblog for Get axcora cms - on progress development... yes this is our cms project from get simple, so you can easy download it and upload on hosting, then you can work with admin area and text editor is include , no need database installation, so you can download cuteblog for get axcora on https://axcora.com/getaxcoracms`,
    ],
  },
  {
    name: 'cloud',
    title: 'Cloud with Us',
    date: '16 april 2022',
    author: 'axcora',
    authorlink: 'https://website.axcora.com',
    img: 'https://media.istockphoto.com/vectors/multimedia-content-upload-interface-vector-id1299267805?k=20&m=1299267805&s=612x612&w=0&h=h2TKY77Vcd2144vvjYZbn2eTQr6XoHxDLPMKvI4jU7Q=',
    desc: 'Create and build your modern website with us for best solutions',
    content: [
      `If you need to build and develop modern website using modern technology like static site generator with jekyll, eleventy 11ty , astro or user react, svelte kit, angular so you can use our services with cheap price`,
      `Or you need to create web app where website integration with your point of sale application so we can do it , with multiple technology let's get started build your website application including android app.`,
      `Contact Us`,
      `Whatsapp : +6285646104747`,
      `Call Us : +62895339403223`,
      `Email : axcora@gmail.com`,
    ],
  },
];

export default articles;
