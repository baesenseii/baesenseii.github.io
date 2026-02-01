---
title: Multi Cloud Red Team Analyst Certification by CyberWarfare Labs
draft: false
categories: [certs, mcrta]
date: 2025-01-12
---
Yes, once again, another late entry from my end (got this cert in November 2024) with regards to this freaking review (due to tons and tons of work backlogs, plus i am getting kinda old, lol)

Reference: https://cyberwarfare.live/product/multi-cloud-red-team-analyst-mcrta/
# Preface

Now with all the craze regarding AI and Cloud (especially in school when cybersecurity lecturers themselves are taking basic-level certs on cloud platforms such as AWS), I was wondering if there are any good quality cloud pentesting courses for me to take up. For cloud-based security assessments, i guess the only experience that i managed to get was in CTFs, especially ones that involved AWS IAMs and whatnot. So i do recognise the need for me to build up my skillset in this area of pentesting and eventually red teaming.

A close friend of mine answered my call and asked if i was keen to try this certification out (it was actually like USD 10 for me due to the discount). So I just said, "Well why not la eh? Let's give it a try."
# Lab Environment / Assessment

After purchasing the labs you are presented with credentials (via email) to go through CW Lab's Learning Management System (LMS):

![](/assets/images/certs/Pasted image 20250112184156.png)

The thing is that apparently for the entire lab, I was expected to use this RedCloud OS (https://github.com/RedTeamOperations/RedCloud-OS), which happens to be a variation of the Parrot Security OS distribution (but just with more cloud tools). However, as stubborn as I was, I told myself that "nah, i think i can just do it on my Linux host machine just fine".

Which in this case, after great difficulty, it was actually possible to do it (just by installing the packages listed in the README.md file of the RedCloud-OS GitHub repository).

Within the LMS itself, the MCRTA certification covers three platforms, mainly AWS, GCP and Azure. These three platforms are basically the three modules that are required for the student to clear in order to obtain the certification.

The study materials were mainly videos with narratives/explanations on the slides etc. To be frank I was not the kind to watch videos first, and then go do the labs. I ended up just doing the labs and figuring out what to do along the way.

![](/assets/images/certs/Pasted image 20250112184700.png)

If you notice the screenshot above, there is the 'Flag' tab right? So what it is actually a series of questions (10 of them in total) that the student needs to answer in order to clear the module. The answers to these questions are usually based on the lab environment provided for the practice, and students are to use whatever they learnt in the slides/video lectures to get the answers.

As for the certification assessment, surprisingly there was no need to do any exam booking whatsoever (unlike the usual certifications that I went through). In order to be certified, you simply need to clear all three modules (finish all the 'Flag' tabs) and then you will be awarded with the certification:

![](/assets/images/certs/Pasted image 20250112191421.png)
# Feedbacks / Opinions

The content is pretty good for anyone to start off on the 3 cloud platforms, but let's evaluate them based on two things: learning outcomes and the assessment (like how all subjects/modules are designed in any institution).
## Learning Outcomes

Based on the website, these are the things that I am expected to learn by the end of the certification:

| Learning Outcome | Personal Experience and Feedback |
|--|--| 
| Perform Red Team Operations in Multi-Cloud Environment | In the slides it was more of a high-level overview of what type of red team (or rather cloud pentest) engagements within the three cloud platforms (AWS, GCP, Azure).<br><br>Unfortunately during the labs/flag finding challenges, majority of the engagement types were more of utilising exposed credentials to ONLY read sensitive data, which I guess this is what the certification wanted to achieve, BUT it wasn't in line to my definition of red team. |
| Learn how to configure credentials and enumerate using CLI | Yeah this was pretty much covered during the labs/flag finding challenges.<br><br>I did spend most of my time reading through the documentation of various tools that interact with the three cloud platforms, which was quite an experience for me.|
| Enumerate core cloud services used in enterprises  | This one was the ONE thing that I felt that was extensively covered for the whole certification (because i do understand that it IS important).<br> |
| Exploit chained misconfigurations in multi-cloud environment | Initially when I read this learning outcome, my first assumption was exploiting misconfigurations to move laterally from one cloud provider to another (which in my honest opinion would have been very cool and interesting to learn to be honest).<br><br>Only to discover that it was just more of exploiting misconfigurations within each of the 3 cloud services covered during the course.|

## Assessment

As mentioned earlier, attaining the certification simply involves completing the flag challenges for each of the modules. The questions designed for the flag challenges are mainly open-ended, which means that the students are expected to type in their answers.

However this led to some experiences/frustrations when submitted answers to certain questions within the flag. For example, when a question asks about a URL as the answer:
- http://thisistheurl.com (right answer, wut)
- http://thisistheurl.com/ (wrong answer, HUH)

Seems to me that the LMS itself doesn't support regular expressions when searching for the answer, or the content creators are quite adamant about only their answers being the acceptable ones. I would think that moving forward, CWL should consider creating questions that would result in unique answers (based on the tools used).

## Final Thoughts

At first glance, not gonna lie, it looks a bit... suspicious. I did initially get the vibes whereby I thought I was paying for a scam certification programme (due to the LMS layout and the content of the slides). But given the price point (with the discount of course), the content and the labs, well I guess I wouldn't complain much about it. I did learn quite a number of things (especially from the GCP and Azure platforms). Now the final two questions:

1) **Would I recommend it to people?**
   
Well why not? And after writing this blog, I noticed that the price point of this certification dropped to USD 49 (when i took it, the original price was USD 98 before the discount):

![](/assets/images/certs/Pasted image 20250112210328.png)

I guess the beauty of it is that the MCRTA content constantly gets revamped (I think like once every 6-12 months if i remember correctly, don't take my word for it), unlike certain modules in my polytechnic that reused content for like more than 5 years and no one wants to change it because of too many responsibilities. So yeah, no harm trying this to be honest!

2) **Who would I recommend it to?**

Probably people who would want to get a quick head start on cloud-based penetration testing / security assessments. I personally don't really like the term red teaming because of the actual definition and the nature of its activities (e.g phishing, AV evasion, etc).
