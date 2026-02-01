---
title: Certified Red Team Professional by Altered Security
draft: false
categories: [certs, crtp]
date: 2024-11-03
---
Note that it's an overdue write-up regarding this certification (achieved it in April 2024), but I think it's good to pen down my honest thoughts about this.  
  
Reference: [https://www.alteredsecurity.com/post/certified-red-team-professional-crtp](https://www.alteredsecurity.com/post/certified-red-team-professional-crtp)  
# Preface  
If you take a look at my certifications, it has been like what, 7-8 years since I did any of the crazy-ass certifications by Offensive Security and CREST (because it was no longer required anyway), which is a pretty long duration of time. Over the years I do reach out to peers and junior cybersecurity professionals to know what changes are there in these certifications (especially with Offsec and CREST certifications getting a syllabus refresh from the last time I took it), and one thing commonly popped up across all these certifications: Windows Active Directory Environments.  
  
I have my fair share of performing network penetration testing activities etc (and i'm still not a pro at it), but I'll be honest though: I am pretty weak when it comes to navigating within AD environments. And with a budget constraint (unlike the old days when my former company sponsors me for certification attempts, but for academia it's a little bit, difficult), I had to be a bit thrifty in terms of what red team / penetration testing certificates to take.  
  
This is when i came across CRTP (which was initially under PentesterAcademy, but now under Altered Security but the certification is still under the same guy Nikhil Mittal, mad respect for his work too especially his Nishang Powershell scripts which were pretty useful in Windows AD environments).  
# Lab Experience  
After signing up for the program you will be provided with credentials and the link to the training portal. The environment does give me the same feel as the days when I took up Offsec certs whereby VPN access was provided to connect my Kali VM to the lab environment. However what was different is that they also had a Guacamole RDP instance to the compromised Windows machine (which was good for me, but there were moments that it was slow, which is fine).  

![](/assets/images/certs/Pasted image 20241103165421.png)

What I really like about this lab is that the primary focus was more of moving laterally across different AD domains and forests (skipping the initial entry part where the lab does an 'assume breach' and credentials of a compromised endpoint was provided). Of course the creds weren't full admin, so we had to some way figure out how to escalate our privileges locally (which was pretty easy using the PowerUp scripts provided).  
  
From there, the labs cover extensively on various AD misconfigurations using a variety of AD enumeration tools (BloodHound being my best friend), ranging from Constraint Delegation Abuse to krbtgt extraction via DCSync. And this course extensively covers the usage of Kerberos Ticket generations (e.g silver tickets, golden tickets, diamond tickets), which is very much the knowledge gap that i needed to bridge from my network pentest experience and certifications. More importantly, this course taught me one VERY VALUABLE lesson regarding Active Directory environments: Don't settle for just Domain Admin, ALWAYS target for the krbtgt hashes.  

And another thing that I really like about this course is regarding the lab materials that are still accessible even after you are done with the course. What's pretty neat about it is that their materials do get updated every 6 months I believe, and I can also access those materials too (except for the lab environment of course, which you need to pay).  
# Assessment  
For the assessment, it's pretty similar to OSCP as it was a 24-hour exam that includes two requirements:  
- Submission of flags obtained from compromised servers  
- Report writeup which also includes recommendations of fixes on the affected servers  
  
And for those who know me, yes i took the exam attempt TWICE (one in January, the other in April due to the 3 month cool-off period). I am not going to disclose much on the details of the assessment (obviously), but this is what I would advise in terms of preparing for the assessment:  
  
1) Be familiar with performing the attacks via both PowerShell and the Windows Command Line  
  
In the labs, CRTP does cover various ways as to how to attain remote access via both PowerShell and Windows Command Line environments (as they are both quite different in nature). This will be very useful whenever you face situations that restrict you on the type of environments that you can use based on what you have.  
  
2) Plan out your resources and methodology  
  
Although the labs have all the necessary commands that you need to run, I felt that arranging them based on how my brain works would be much better. I came up with a set of Obsidian notes to help me document out my commands that i will be using.  
  
As for the infrastructure, I guess it also depends on the individual but what I had in mind was to work like an adversary, which means I will need a C2 platform for me to manage the compromised machines (in addition to the initial access machine that is required of you to gain full admin access to). Interestingly enough, in the lab material I came across this:  
  
![](/assets/images/certs/Pasted image 20241103163957.png) 
  
It was not covered in the CRTP labs, but the PDF document did cover the how-to methods for the Sliver C2 framework via the same attack vectors presented in the labs (and it's pretty easy thanks to the document).  
  
So in short, my strategy was this:  
- Set up my Sliver C2 on my Kali Linux VM (connected via OpenVPN), with listeners and beacons set up.  
- On the 'student' VM (which is the compromised machine), I also transferred some of the tools taught in the lab (OH YA, MAKE SURE YOU HAVE A COPY OF THIS 'Tools' FOLDER BECAUSE THERE'S NOTHING IN THE COMPROMISED MACHINE DURING THE EXAM).  
- In addition, the 'student' VM was configured with portforwarding so that any incoming requests to the 'student' VM will be redirected to my Sliver C2 (for management of compromised targets).  
- Always run SharpHound on new compromised targets so that your BloodHound data is updated  
  
So after two exam attempts, and lots of blood, sweat and tears, I finally managed to get it:

![](/assets/images/certs/Pasted image 20241103165001.png)
# Thoughts  
  
As I have mentioned in my writeup, this certification is probably to me the greatest bridge to those who have taken OSCP a long time ago and wants to bridge the gap on AD environment. I know that the current OSCP syllabus does have elements of Windows AD Lateral Movement, but it isn't that comprehensive as compared to CRTP.  
  
The teaching materials do contain videos as well, but for me it just didn't work as I learn more via trial and error (preferred mode of learning is 'experiential learning').  
  
There were times during the lab sessions that the provided commands didn't work as shown in the labs. This is when I do treasure my moments talking to the CRTP Discord community for advice and help (big shout out to the AltSec-Admin too in terms of fixing environments). But of course it will take some time in replying as I think it's only one person that's managing this (or more, I am not sure actually).  
  
The ultimate question now is this: would I recommend this certificate to people? Definitely, but on a personal note, it would be preferable if you have SOME knowledge in Active Directory as a start. You can easily read up on Active Directory via this website first to kickstart your journey prior to taking up the certification: [https://adsecurity.org/](https://adsecurity.org/)  
  
But if you feel that you want to just jump in, by all means go for it! This is just my point of view if your intent is to pass the certification for the first time.