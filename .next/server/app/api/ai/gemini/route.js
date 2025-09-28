"use strict";(()=>{var e={};e.id=119,e.ids=[119],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5167:(e,t,o)=>{o.r(t),o.d(t,{headerHooks:()=>p,originalPathname:()=>y,requestAsyncStorage:()=>d,routeModule:()=>u,serverHooks:()=>c,staticGenerationAsyncStorage:()=>l,staticGenerationBailout:()=>m});var r={};o.r(r),o.d(r,{POST:()=>POST});var a=o(884),i=o(6132),n=o(5798),s=o(148);let h=new s.$D("AIzaSyCc31Jd60YeAoVxKcusp5ALBxBr6LCTPic");async function POST(e){try{let{journalText:t,azureAnalysis:o}=await e.json();if(!t||!o)return n.Z.json({error:"Journal text and Azure analysis are required"},{status:400});let r=h.getGenerativeModel({model:"gemini-2.5-flash"}),a=`
You are Athena, the Greek goddess of wisdom, warfare, and crafts. A mortal has shared their journal entry with you, seeking guidance. 

MORTAL'S REFLECTION:
"${t}"

EMOTIONAL ANALYSIS (from Azure AI):
- Overall Sentiment: ${o.sentiment}
- Positive emotions: ${Math.round(100*o.confidenceScores.positive)}%
- Neutral emotions: ${Math.round(100*o.confidenceScores.neutral)}%
- Negative emotions: ${Math.round(100*o.confidenceScores.negative)}%

As Athena, provide specific, relevant advice based on their exact words and situation. Vary your response style and personality based on their emotional state and content.

RESPONSE STYLES (choose one that fits best):
1. WISE MENTOR: "Hearken, mortal soul..." - Gentle, philosophical guidance
2. WARRIOR GODDESS: "Listen well, brave one..." - Strong, empowering, action-oriented
3. CRAFTSPERSON: "I see your hands at work..." - Practical, skill-focused advice
4. ORACLE: "The threads of fate reveal..." - Mystical, prophetic insights
5. TEACHER: "Let me share with you..." - Educational, instructive tone
6. PROTECTOR: "Fear not, for I am with you..." - Comforting, protective guidance

Guidelines:
- Reference specific details from their journal entry
- Address their exact concerns or celebrate their specific achievements
- Vary your opening and closing based on the situation
- Use different metaphors and analogies (olive trees, weaving, battles, temples, etc.)
- Match your tone to their emotional state
- Provide actionable advice tailored to their situation
- Keep response between 80-150 words
- End with "May wisdom guide your path. - Athena" or similar

Focus on their specific situation and choose the most appropriate Athena personality for their needs.
`,i=await r.generateContent(a),s=await i.response,u=s.text();return n.Z.json({response:u})}catch(t){console.error("Gemini oracle failed:",t);let e=(e=>{let t=e.toLowerCase(),o=[];return t.includes("work")||t.includes("job")?o.push("Listen well, brave one, I see you wrestling with the forge of your career. Like Hephaestus crafting his finest works, true mastery comes not from avoiding challenges, but from embracing them. Your hands are meant for great things. May wisdom guide your path. - Athena","I see your hands at work, mortal, shaping your destiny through labor. The craftsman's path is never easy, but each challenge hones your blade sharper. Remember: even the greatest temples were built stone by stone. May wisdom guide your path. - Athena","The threads of fate reveal your professional journey, and I see both struggle and triumph ahead. Like the weaver who creates beauty from chaos, you too can transform challenges into opportunities. May wisdom guide your path. - Athena"):t.includes("relationship")||t.includes("love")?o.push("Fear not, for I am with you in matters of the heart. Love, like the olive tree, grows slowly but bears the sweetest fruit. Speak your truth with courage, listen with compassion. May wisdom guide your path. - Athena","Let me share with you the wisdom of the ages: relationships are like the intricate tapestries I weave - each thread matters, each color adds depth. Be patient with yourself and others. May wisdom guide your path. - Athena","Hearken, mortal soul, I feel the weight of your heart's desires. Like the warrior who protects what they love, guard your relationships with both strength and gentleness. May wisdom guide your path. - Athena"):t.includes("anxiety")||t.includes("worry")?o.push("Listen well, brave one, for I have faced many battles and know the weight of worry. Like the warrior who prepares for battle, your anxiety is not weakness but preparation. Channel this energy into action. May wisdom guide your path. - Athena","The threads of fate show me your troubled mind, but I also see your inner strength. Like the olive tree that bends in the storm but never breaks, you too will weather this tempest. May wisdom guide your path. - Athena","I see your hands trembling with worry, but know this: courage is not the absence of fear, but action in spite of it. Like the craftsman who works through uncertainty, focus on the task before you. May wisdom guide your path. - Athena"):o.push("Hearken, mortal soul, I sense the depth of your contemplation. Your words carry the weight of genuine reflection, and I am honored by your trust. In the quiet moments of self-examination, we often discover our greatest truths. May wisdom guide your path. - Athena","Listen well, seeker, for I hear the echoes of your thoughts. Like the weaver who creates beauty from simple threads, you too are crafting something meaningful from your experiences. May wisdom guide your path. - Athena","The threads of fate reveal a thoughtful soul before me. Like the olive tree that grows stronger with each season, your wisdom deepens with each reflection. May wisdom guide your path. - Athena"),o[Math.floor(Math.random()*o.length)]})(journalText);return n.Z.json({response:e})}}let u=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/ai/gemini/route",pathname:"/api/ai/gemini",filename:"route",bundlePath:"app/api/ai/gemini/route"},resolvedPagePath:"/Users/rohit/Documents/Projects/girlhacks-2025/app/api/ai/gemini/route.js",nextConfigOutput:"",userland:r}),{requestAsyncStorage:d,staticGenerationAsyncStorage:l,serverHooks:c,headerHooks:p,staticGenerationBailout:m}=u,y="/api/ai/gemini/route"}};var t=require("../../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),o=t.X(0,[997,148],()=>__webpack_exec__(5167));module.exports=o})();