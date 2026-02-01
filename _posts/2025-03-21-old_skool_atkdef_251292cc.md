---
title: "Bringing back the old school: Good ol' Attack-Defense CTF Environments"
draft: false
categories: [projects, attkdef-ctf]
date: 2025-03-21
---
I think this would be one of the most technical and lengthy writeup that I have ever done since The InfoSecurity Challenge 2024 CTF writeups by CSIT.
# Preface  
  
For those of you who may not know, I "volunteered" to be one of the Worldskills Coaches under the Cyber Security trait to train individuals to represent the polytechnic that I'm working in. Being the ONLY lecturer with CTF/Cybersecurity competition experience, I took up the responsibility of training the students for the CTF component (as it is part of the actual competition based on the technical specs here):
- [http://www.worldskills.sg/docs/default-source/default-document-library/wss2025_technical-description_cybersecurity.pdf?sfvrsn=9fc583ad_0](http://www.worldskills.sg/docs/default-source/default-document-library/wss2025_technical-description_cybersecurity.pdf?sfvrsn=9fc583ad_0)

While deciding on the training type to use, I thought about this to myself: *"Jeopardy CTFs are just too overrated and boring. What happened to the OG CTFs that I used to take part when I was a student?"*  
  
And that, is when the idea of bringing back a Attack-Defense CTF was born. :)  
# Brainstorm Phase  
## Jeopardy CTFs vs Attack-Defense CTFs

Not sure how much you know about these two CTF types, but let me just do my take on these CTF modes, along with the pros and cons.
### Jeopardy CTF  

I am sure many of us in the Cyber scene are familiar with Jeopardy CTFs whereby participants attempt various challenges with one goal in mind: submit the CORRECT flag for the challenge. Based on my observation, I feel that Jeopardy CTFs can achieve the following outcomes:

- Learn a new skill/concept based on the challenge category (e.g pwn -> buffer overflow/ret2win, web -> perform SSTI with WebApps that have blacklist filters)  

- Accelerate transfer of knowledge based on the challenge on an exponential scale, due to the time crunch and gamification of learning.  
  
However, there are its drawbacks (in my humble opinion, many might disagree but please do let me know as this is merely my opinion):

- Based on CTFs that I personally have attended over the years, I feel that there are CTF challenges that were just made to "make life difficult for others to learn".  

- Real-world scenarios and implementations in most organisations involve a myriad of IT assets, networks and security controls in place. While each CTF challenge covers a specific area of knowledge that the challenge creator wants participants to learn, going up against real-world scenarios and systems involve demonstrating and chaining multiple areas of knowledge in order to solve the problem at hand.
	- For example, a hacker managed to identify a custom network service that has been identified to have SQL injection and an administrative API call that is susceptible to a buffer overflow attack. So how now?

- Based on my experience in teaching students, nowadays the gathering and analysis of information tends to be a daunting task for the students (and most of the time they throw it to GenAI tools like ChatGPT, in hopes that they can "get the answer").  
### Attack-Defense CTFs  

For this CTF, teams are given assets (of various services and vulnerabilities) to defend/harden while attempting to gain access to assets of other teams to score points. This, in my opinion, would the closest thing for participants to experience a red team vs blue team exercise (in fact I would call it 'almost purple' because teams are to both attack and defend, and there's no threat intelligence element)  
  
In terms of knowledge building, AttkDef CTFs primarily focus on the application of known knowledge (e.g hardening/lockdown of servers, securing administration services such as SSH, HTTPS, etc). Of course, depending on the complexity, sometimes network devices are also involved as part of the assets (but i have my reservations on this). 

So if you haven't done any form of server administration, quite frankly doing this CTF as a blue teamer is gonna be tough.  
  
But now, onto its drawbacks:
- As these involve actual hardware components that make up the infrastructure of the CTF, gamemasters would now have to serve as IT Helpdesk personnel. In my years of playing these type of CTFs, due to the inexperience of some of the teams, issues such as getting locked out from the assets, or restoration of assets due to opposing teams "accidentally" wiping the asset software were pretty common.  
- As all the competitor equipment and their assets all reside within the same physical network, network-based DDoS attacks are a huge cause of concern (despite informing people NOT to do it during the briefings). I remember playing in one of the AttkDef CTFs whereby I wasn't able to access the web servers of all opposing teams as someone was apparently running a SlowLorris attack.  
### Final Decision

Eventually I decided to use the AttkDef CTF format, as I felt that this CTF format would be very useful to pit the teams against each other in terms of both blue and red teaming skills.
  
So we got the format up, next are the following questions to answer in order to move forward:  
- What equipment do I have right now?  
- What networks/subnets do I need?  
- How do we keep track of scoring?  
- How many targets will there be for each team? Are the targets unique per team, or duplicates for all teams?

And the most important question to ask while designing this: DO WE HAVE MOOLAH to support this? Well at that point in time, I will definitely have to say.. no.
# Design Phase
## Network Diagram Overview
Well the first thing we need to do is to draw up a simple network diagram to understand what components are required in this case:

![](/assets/images/attkdef_platform/Pasted image 20250320211839.png)

As a description of what this diagram is about:
- Only two teams will be playing this exercise, with each team having his/her own attacker network, defender network, and a set of targets.
- A scoreboard will be created to check the status of the applications hosted on the target network (both Team 1 and Team 2).
- All app servers are configured with Wazuh agents + Snort IDS to improve detection rules.
- Both teams will have a Wazuh XDR SIEM for them to practise their detection capabilities.
- And ALL of these machines and networks are to be used on ONE powerful server (because I do not have the luxury to have MULTIPLE powerful servers)

In terms of the network access control measures, here's a scuffed access control matrix table to give you some clarity on how the firewall rules are to be implemented in the KOTH-ROUTER (or just a core router in general):

|                               | **Attacker Network (Team 1)** | **Defender Network (Team 1)** | **Target Network (Team 1)**                         | **Attacker Network (Team 2)** | **Defender Network (Team 2)** | **Target Network (Team 2)**                         | **Scoreboard** |
| ----------------------------- | ----------------------------- | ----------------------------- | --------------------------------------------------- | ----------------------------- | ----------------------------- | --------------------------------------------------- | -------------- |
| **Attacker Network (Team 1)** |                               |                               |                                                     |                               |                               | X                                                   |                |
| **Defender Network (Team 1)** |                               |                               | X<br><br>SSH to app machines via TCP 3222 (as root) |                               |                               |                                                     | X              |
| **Target Network (Team 1)**   | X                             | X                             | X                                                   | X                             |                               |                                                     | X              |
| **Attacker Network (Team 2)** |                               |                               | X                                                   | X                             |                               |                                                     |                |
| **Defender Network (Team 2)** |                               |                               |                                                     |                               |                               | X<br><br>SSH to app machines via TCP 3222 (as root) | X              |
| **Target Network (Team 2)**   |                               |                               |                                                     | X                             | X                             | X                                                   | X              |
| **Scoreboard**                |                               | X                             | X                                                   |                               | X                             | X                                                   |                |

The main VM that will be implementing the network rules is the KOTH_ROUTER VM, which is just simply a Ubuntu Server VM with IP Forwarding + iptables enabled. IPTables will serve as an enforcer of the above access control matrix table, with the default INPUT policy set to 'DROP'.

At this stage the design seems like a good idea, but there's just one problem: The server that I wanted to use was located in one of the Level 6 labs where it was such a big hassle to move it to the training area (which was at Level 2). The last time I pushed this rack to do an on-site CTF, the wheels were badly damaged due to the flooring and the equipment was left untouched for quite a significant amount of time. So we need to find a way to figure out how we can connect these users to this server:

![](/assets/images/attkdef_platform/Pasted image 20250320214904.png)

## Introduction to Software Defined Networking (SDN) Platforms

Honestly speaking, I didn't knew at first what SDN meant, even though I kept hearing this buzzword so many times when I was conducting an 'Introduction to 5G' workshop for external clients. I know what it does in terms of high-level, but didn't know of any examples until I realised that I have been using ONE before:

![](/assets/images/attkdef_platform/Pasted image 20250320215647.png)

Back in the days before Steam, whenever my friends and I wanted to play Counter-Strike together, we would use this Hamachi VPN in order for us to connect to the Counter-Strike server hosted by one of my friends. How it works is that:
- It is required to sign up for an account in Hamachi VPN so that you can get a Hamachi ID.
- Install Hamachi VPN on your system.
- Create a Hamachi Network ID and share it with your friends.
- Your friends join in your network via the Hamachi Network ID (in which you will need to approve your friend who is joining into the network)
- You can now communicate with each other based on the IP address provided by Hamachi VPN, as long as your device is **connected to the Internet :)**

In other words, SDN platforms like Hamachi allows for privatised peer-to-peer networks, and users can create it with no extra cost. However, this absence of cost does comes with limitations, in which if you would want to expand it you will have to pay for it. For Hamachi, I can only have up to 5 Hamachi users across all the Hamachi Networks that I own, which kinda sucks to be honest as i do want to consider at least like a 3v3 matchup for the platform.

So this led to me in researching for other SDN alternatives, and I came across this SDN called ZeroTier (https://www.zerotier.com):

![](/assets/images/attkdef_platform/Pasted image 20250320221553.png)


Based on the pricing, it seems that the Basic version allows me to connect up to 10 devices across 3 networks. However, this kind of contradicts the current Free plan that I am having currently as I can create unlimited networks but up to 25 devices (as shown in the screenshot below):

![](/assets/images/attkdef_platform/Pasted image 20250320221453.png)

However, this can be easily solved by creating more than 1 account to increase the support for network devices and the networks to create, as what really matters at the end of the day is the ZeroTier Network ID. Now what's even more interesting about ZeroTier is that, unlike Hamachi (to my knowledge), ZeroTier allows you to customise what private subnet that you want to use for the network (which makes it totally awesome as it will help with the network diagram):

![](/assets/images/attkdef_platform/Pasted image 20250320223621.png)

Using ZeroTier, a finalised network diagram was made to include even the ZeroTier IDs to join:

![](/assets/images/attkdef_platform/Pasted image 20250320223817.png)

Do take note of the following:
- The target networks for both Team 1 and Team 2 are categorised as 'Internal' which means that the apps/services are going to be hosted via Vagrant with VirtualBox as the virtualisation engine.
- I also created a ZeroTier Network for management purposes so that I can SSH directly into the physical server that is hosting the virtualised applications and access all the virtualised machines accordingly using ```vagrant ssh```
## Getting Internet Access for a standalone server

If you had noticed the picture above showing the server used, there is no nearby LAN port whatsoever that allows my server to obtain Internet access. And based on what we discussed in our network diagram, Internet access IS MANDATORY in order to:
- Establish SD-WAN connections to the ZeroTier networks
- More importantly, to launch our Vagrant machines (which require the download of Vagrant boxes from the Internet)

The way to solve this solution is pretty simple:

![](/assets/images/attkdef_platform/Pasted image 20250320225743.png)

As you can see here in this picture, notice that there's a small Raspberry Pi. This device is currently acting like a modem+router using the following approach:
- WiFi adapter connected to the Guest network in the school premises (just a simple login with my credentials worked fine)
- In the Raspberry Pi, the following configurations were done:
	
	- Enable IP forwarding via sysctl
	- Configure a static IP address on the LAN port of the RPi (e.g 10.10.10.1/30)
	- Configure the following iptables rule to perform NAT via the WiFi adapter as the outgoing interface (in this example below it is wlan0):

	```
	iptables -t nat -A POSTROUTING -j MASQUERADE -o wlan0
	```
	
	- Ensure that it is persistent by installing the 'iptables-persistent' package and save the iptable rules (note that i was running Raspbian OS):
	
```
	sudo apt update && sudo apt install -y iptables-persistent;
	iptables-save > /etc/iptables/rules.v4
```
## App Deployment & Access Isolation

Based on previous experiences of organising CTFs and providing students environments to practise their skills, one thing that stresses me out is the level of access that the participant has to the target machines. Looking at the access control matrix, it can be seen that anyone in the defender network is able to access their own targets (which is allowed of course, in order to allow participants in hardening the server and implement their detection controls via Wazuh).

So the real question remains: do I allow SSH access to the Vagrant machine, or the Docker container?

After much thought, I decided to only allow key-based root SSH access to the Docker container (through TCP 3222) due to the following reasons:

- The attackers, upon gaining initial access to the vulnerable service, would most likely be residing within the Docker container. This means that as a defender, you should perform your hardening and detection controls within the environment that the attacker is going to be in (which is the Docker container itself)

- TCP port 3222 was selected because of the dynamic port range that Vagrant uses when deploying boxes via SSH (usually within the ranges of 2220 to 2999)

- From the administrator's perspective (which is me), if the whole vagrant machine is screwed up, at least i can just SSH directly to the physical server and run ``` vagrant destroy -f ``` and ```vagrant up```. This gives me more granular administrative control as compared to the defenders (which makes sense as I am the gamemaster after all)

The diagram below shows an example of how each target application is being deployed within the platform:

![](/assets/images/attkdef_platform/Pasted image 20250320231654.png)
## Scoreboard Creation

For this, truth be told that I didn't do much for this component as it took me quite a while to find a good scoreboard system that is based on King of The Hill. However I was lucky enough to come across this repository: 
- https://github.com/InjectionSoftwareandSecurityLLC/Propane

It was pretty intuitive to use as it's based on Flask, and in this case I had to change the HTML templates a bit to suit to the training environment. Basically if you want to score a point on a target that you have compromised, you are to add the following custom tag in the main page of the web application (the value to specify is configured inside the propane_config.ini file):

```
<team>faint</team>
```

Only one tag is allowed within the page, and if successful, you will see something like this on the compromised target:

![](/assets/images/attkdef_platform/Pasted image 20250320235241.png)

The scoreboard will do a constant poll on the websites hosted on all the targets, and the points will start to increase as long as the tag remains within the index page of the website hosted on TCP 80.
## Automated Deployment

Of course, how can I even forget this? Automation is definitely the ultimate form of smart laziness. And thanks to my constant meddling with IaC code via Vagrant and Docker, I created two scripts that would help deploy the platform without any issue (but there are still some manual actions to be done during the deployment process such as authorising the boxes to the ZeroTier networks):

- generator.py - Generates an entire deployment folder (called a project) that dynamically performs the following:
	- Generation of the IaC files (e.g Vagrantfile, Dockerfile) based on the configuration file provided (config.txt), which also includes the routes and installation/configuration of the Wazuh agents.
	- Generation of the SSH keys used for root access to the Docker containers (for the defenders)
	- Dynamic generation of the IP addresses for the targets (for randomisation purposes)

- manager.py - Allows the administrator to start/stop/ssh any Vagrant boxes belonging to the project without the need to specify the Vagrant ID or navigate to the current working directory of the Vagrant machine. 

![](/assets/images/attkdef_platform/Pasted image 20250320233257.png)
# Outcome

Thankfully I had an opportunity to test this deployment out in school with some of the students (mainly for the Worldskills team), and we did have lots of fun in this case:

![](/assets/images/attkdef_platform/Pasted image 20250320233056.png)

*Note: The scoreboard shows the labelling of the targets (e.g T1_Target1 = Target1 machine owned by Team 1). The names with the light blue highlights are the members of the opposing team that managed to hack into the target by planting the following tag: 

```
<team>faint</team>
```

As I was playing in Team 2, I also took the opportunity to try out establishing a C2 server using Sliver with multiplayer mode enabled (which was sooooo badass to be honest):

![](/assets/images/attkdef_platform/Pasted image 20250320234349.png)

But what made me even more curious was to figure out how we could actually detect the attacks using the Wazuh rules that the team had customised (in addition to the default rulesets), however due to the mood and performance from the other team (based on the scoreboard), I don't think we managed to get an opportunity to do so.
# Thoughts

As of now, I personally feel that cybersecurity education is too decoupled and heavily focused on blue team elements and not red team elements. Based on my observation, it seems that whenever students learn about the security aspects (e.g auditing, network security, forensics), they do not seem to be convinced on the rationale of the implementations/actions even with the explanations (apart from the fact that it's part of 'security best practices'). Therefore, the best way to make students understand the rationale is going through an actual scenario, which is a form of experiential learning. 

I personally feel that this platform provides a really good summary exercise for students in cybersecurity to establish the bridge between both aspects of red and blue elements. The funny thing about it is that this is regularly practised in the industry, in the form of Table Top Exercises. So the important question here is, shouldn't we all be doing it as well?

Just a food for thought on this issue, and I hope that I could encourage more people to try setting up such environments (with my tool hopefully). The public version of this platform is here: https://github.com/baesenseii/atkdef_platform/

Just raise the issues if there's anything else that needs to fix!