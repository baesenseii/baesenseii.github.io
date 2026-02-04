---
layout: post
title: "SparkSIM - A Low-Cost Red vs Blue Platform for Student Red Teamers"
date: 2026-02-04
categories: [research, red-team, blue-team, ctf, education]
---

In a previous article, I discussed the current state of CTF competitions and how the landscape has become saturated with jeopardy-style CTFs. While these competitions are valuable learning tools, they often fail to prepare aspiring penetration testers for one critical aspect of real-world security work: Operational Security (OPSEC).

Many students entering the field don't understand that even authorized attacks are still attacks. Every action leaves traces. Every command generates logs. Every exploit triggers alerts. In real penetration testing engagements, these activities can trigger incident response protocols, potentially complicating the engagement despite being fully authorized. Understanding how to operate stealthily, how defenders see your actions, and how to balance effectiveness with discretion is crucial for professional red teamers.

To address this gap, I designed SparkSIM—a red versus blue simulation environment. I invited several students who had participated in SparkCTF, our internal Capture the Flag competition catered for Temasek Polytechnic students, to experience security from both sides of the fence.

## Event Overview

SparkSIM ran for one complete week during the final days of 2025, from December 26th at 12:00 AM through January 2nd, 2026 at 12:00 AM. The competition was structured as a closed-door session with limited participants to ensure quality interaction and learning.

### Team Composition

The participants were divided into two distinct teams:

**Red Team:** Comprised primarily of invited participants from SparkCTF who showed promise in offensive security. These students had demonstrated technical aptitude but lacked exposure to defensive perspectives and OPSEC considerations.

**Blue Team:** A carefully selected group of former students and colleagues from Temasek Polytechnic who had experience in defensive security, incident response, and system administration.

### Network Architecture

The environment consisted of four machines connected in a linear topology—essentially a linked list structure. This design was intentional: it forced red teamers to progress through each machine sequentially, preventing them from skipping ahead and ensuring they experienced the full attack path. I'll admit the linear design was also partly motivated by my laziness in setting up complex routing configurations.

![](/assets/post-images/2026-02-04-sparksim_red_vs_blue_platform_9decf35e/sparksim-network-diagram.png)

*Figure 1: SparkSIM network topology showing the linear progression from DMZ through C1, DC, to C2*

If you want the full network diagram, [<u>click here</u>](/assets/html/network-diagram-complete.html)

The attack path followed this progression:

| **Node Name** | **Attack Vector** |
|---------------|-------------------|
| DMZ (Start Point) | Web Application (Betting Portal)<br>- AV1: Polyglot PHP File Upload to RCE<br>- AV2: SQL Injection with Root File Write Capability |
| C1 | Vanilla Buffer Overflow Vulnerability on custom Windows application (HOSEHBO)<br>Cached Domain Admin Credentials |
| DC | Authenticated Lateral Movement with Domain Admin Credentials |
| C2 | Authenticated Lateral Movement with Domain Admin Credentials via WinRM |

## The Blue Team Setup

### Solving Asset Management Challenges

During my previous attempt at designing an attack/defense CTF, I identified several critical pain points in managing the blue team infrastructure:

1. **Credential Overload:** Managing administrative credentials across multiple targeted assets became overwhelming. Different SSH keys for different machines, various usernames and passwords—it was a nightmare to organize and share securely with team members.

2. **Access Tracking:** There was no efficient way to track the last time an asset was accessed, making it difficult to correlate defensive actions with timeline events.

3. **Application Sprawl:** Defenders needed to launch separate applications for different tasks—Remote Desktop Connection for Windows machines, terminal sessions for SSH access, different tools for different protocols. Context switching slowed down response times.

### Apache Guacamole: Centralized Access Control

To address these challenges, I implemented Apache Guacamole as a centralized access gateway. Guacamole is a clientless remote desktop gateway that supports standard protocols like RDP, SSH, and VNC entirely through a web browser—no plugins or client software required.

![](/assets/post-images/2026-02-04-sparksim_red_vs_blue_platform_9decf35e/sparksim-guacamole-sample.png)

The implementation strategy involved creating separate user accounts for blue teamers based on their roles:

- **Incident Responders:** Granted access only to Windows machines via RDP and DMZ SSH access for log analysis
- **Security Engineers:** Full access to the Wazuh SIEM box for security monitoring and alert management

This role-based access control (RBAC) approach meant that team members only saw the systems relevant to their responsibilities, reducing complexity and potential for mistakes.

### Tailscale: The Networking Game-Changer

In my previous attack/defense CTF, I had used ZeroTier for creating isolated network zones. While functional, ZeroTier presented significant operational overhead. Every machine required manual approval through the ZeroTier admin console, making onboarding tedious and time-consuming.

Tailscale proved to be a revelation. The killer feature that made everything smoother was the ability to onboard machines using authentication keys. Even better, these keys could be configured to automatically assign tags during onboarding, which we leveraged extensively for access control.

#### The Onboarding Process

For the blue team infrastructure, we created a reusable authentication key tagged with `sparksim-def`. This key was distributed to all blue team members to onboard their personal devices into the defensive Tailnet. The Wazuh SIEM and Guacamole machines were also configured to join the `sparksim-def` Tailnet, making them instantly accessible to authenticated blue team members.

For red team participants, we generated a separate reusable key tagged with `sparksim`. This separation was crucial—it allowed us to implement network-level access controls based on tags, ensuring proper isolation between offensive and defensive infrastructure while maintaining simplicity in deployment.

The beauty of this approach was its simplicity: participants just needed to install Tailscale and authenticate with their provided key. No manual approval queues, no waiting for admin intervention—just instant network access with proper segmentation.

## Conduct of Event

The SparkSIM exercise was conducted as a closed-door session with eight student participants. The competitive element remained strong—only four participants successfully compromised all machines and gained access to C2, the final target.

### Objective Verification: Beyond Static Flags

One of my primary design goals was ensuring that participants achieved genuine hands-on objectives rather than just collecting shared flags. In traditional CTFs, static flags suffer from a critical flaw: flag sharing. Once one person finds a flag, it can spread through the entire community, defeating the purpose of the challenge.

Since all participants were already in the SparkCTF Discord server, I needed a verification mechanism that confirmed actual system access while preventing flag sharing. Simply placing a static flag on C2 wouldn't work—it would inevitably be shared among participants.

#### The Dynamic Verification Bot

The solution was implementing a Discord bot with dynamic, personalized verification:

**Architecture:**
1. The Discord bot was deployed on the blue team (`sparksim-def`) network with visibility into the competition infrastructure
2. The bot maintained a WinRM connection to C2 using a high-privileged service account
3. Upon receiving a participant's request, the bot would:
   - Scan the C:\ drive to identify folders with write permissions
   - Randomly select one of these writable folders
   - Generate a unique SHA256 hash
   - Create a file named `secret.txt` containing this hash in the selected folder
   - Store the hash and folder location in memory, associated with the requesting user

**Verification Process:**
1. Participants would send a direct message to the Discord bot
2. The bot would respond with the randomly selected folder location
3. Participants needed to navigate to C2, find the file, and send its contents back to the bot
4. If the hash matched, the bot would:
   - Record the participant's Discord username on the scoreboard with a timestamp
   - Delete the current `secret.txt` file
   - Generate a new random folder, hash, and file for the next verification

This approach ensured that:
- Each verification was unique and time-limited
- Participants couldn't share answers (the hash changed after each successful verification)
- We had proof of actual system access, not just flag knowledge
- The verification remained automated and scalable

I won't share the complete bot source code here, but with modern AI tools like Claude (yes, Claude helped me build this bot), creating similar verification mechanisms is straightforward.

![](/assets/post-images/2026-02-04-sparksim_red_vs_blue_platform_9decf35e/sparksim-bot_flagsubmission_1.png)

### Real-Time Intelligence Feed

Communication and situational awareness are critical in both offensive and defensive operations. To simulate realistic intelligence sharing, I created a `#sparksim-bulletin` text channel that served as a centralized intelligence feed.

This channel provided daily and real-time updates about:
- Detected intrusion attempts
- Defensive actions taken (e.g., account lockouts, service restarts)
- System changes and patches applied
- Alert summaries from the Wazuh SIEM
- Incident response activities

The feed was deliberately made visible to both red and blue teams. This design choice created an interesting dynamic—attackers could see defensive responses, and defenders knew their actions were being observed. It mimicked how threat intelligence operates in real organizations, where defenders share information to make informed decisions, while sophisticated attackers monitor their targets' security posture.

This transparency forced red teamers to consider their OPSEC carefully. If they were too noisy and triggered alerts, they'd see the blue team's response in near real-time. It also allowed blue teamers to demonstrate their detection capabilities and potentially deter certain attack paths through visible defensive actions.

![](/assets/post-images/2026-02-04-sparksim_red_vs_blue_platform_9decf35e/sparksim-bulletin_1.png)

![](/assets/post-images/2026-02-04-sparksim_red_vs_blue_platform_9decf35e/sparksim-bulletin_2.png)

## Results and Analysis

Of the eight participants, only four successfully compromised all four machines and gained access to C2. This 50% success rate was actually ideal—it indicated the difficulty was well-calibrated. The environment was challenging enough to be meaningful but not so difficult that it discouraged learning.

![Scoreboard Results](/assets/post-images/2026-02-04-sparksim_red_vs_blue_platform_9decf35e/sparksim-scoreboard.png)
*Figure 2: Final scoreboard showing successful C2 access timestamps*

### Behavioral Observations

One of the most interesting aspects of SparkSIM was observing participant behavior throughout the week:

**Initial Competition Mindset:** At the start, participants were extremely reluctant to help each other. They treated SparkSIM like a traditional CTF where collaboration meant giving up competitive advantage. Players focused narrowly on their assigned objectives, hoarding information and techniques.

**Evolution Toward Collaboration:** As the week progressed and participants encountered increasingly complex challenges, I noticed a shift. Students began sharing reconnaissance findings, discussing defensive countermeasures they observed, and even coordinating multi-phase attacks. This collaborative evolution was exactly what I hoped to see—it mirrors how real red team engagements operate.

In professional red teaming, success depends on team coordination. Specialists in web exploitation, Active Directory attacks, social engineering, and persistence mechanisms must work together seamlessly. No single person can be expert in everything. SparkSIM successfully demonstrated this reality to participants who were accustomed to solo CTF problem-solving.

## Personal Reflections

### The Defender's Perspective

Running both red and blue teams simultaneously provided me with invaluable insights. Playing the blue team role was particularly eye-opening. I had conducted penetration tests before, but seeing attacks from the defensive side completely changed my understanding of operational security.

**Attack Noise and Detection:** The participants' attacks were incredibly noisy. Actions I might have considered "stealthy" in isolation became glaringly obvious when viewed through defensive monitoring tools. Rapid-fire login attempts, unusual process execution patterns, abnormal network connections—all of these generated clear indicators of compromise.

The Wazuh SIEM captured nearly everything:
- Failed authentication attempts from unusual source IPs
- Process creation events for suspicious binaries
- File modifications in sensitive directories
- Network connections to C2 infrastructure
- PowerShell execution with suspicious command-line parameters

Reviewing these logs made me fundamentally reconsider how I approach red team engagements. Even authorized penetration testing triggers incident response protocols. While we have permission to attack, we're still generating alerts, consuming defensive team resources, and potentially disrupting operations. Being conscious of this impact and minimizing unnecessary noise should be a professional responsibility.

### OPSEC Consciousness

SparkSIM successfully instilled OPSEC awareness in participants. By making the `#sparksim-bulletin` channel visible to attackers, they could see exactly when their actions were detected. Some examples from the feed:
```
[2024-12-27 14:23:15] ALERT: Multiple failed SSH authentication attempts detected from 100.x.x.x targeting DMZ host
[2024-12-27 14:25:42] ACTION: Temporary IP block applied to 100.x.x.x for 30 minutes
[2024-12-28 09:15:33] ALERT: Unusual PowerShell execution detected on C1 - Investigating
[2024-12-28 09:18:21] ACTION: Suspicious process terminated, forensic snapshot captured
```

Seeing these real-time responses forced attackers to think about their operational security. Some participants adapted by:
- Slowing down their enumeration to avoid rate-based detection
- Using legitimate system tools instead of obvious hacking utilities
- Spacing out authentication attempts
- Clearing logs more carefully (though this also generated alerts)

These adaptations represent exactly the mindset professional red teamers need—constantly thinking about how defenders see your actions and adjusting techniques accordingly.

### The Value of Attack/Defense Formats

SparkSIM reinforced my belief that attack/defense exercises provide vastly superior learning experiences compared to traditional jeopardy CTFs for students aspiring to professional offensive security roles.

**Skills Developed in SparkSIM That Traditional CTFs Don't Teach:**
- Understanding defensive visibility and detection capabilities
- Operational security and attack noise management
- Persistence strategies that balance effectiveness with stealth
- Log manipulation and anti-forensics techniques
- Collaboration and team coordination under pressure
- Time management in extended engagements
- Adapting to active defenses and incident response

Traditional CTFs excel at teaching exploitation techniques and problem-solving skills. But they don't prepare students for the reality that every action has consequences, every command generates logs, and professional security is a conversation between attackers and defenders.

## Lessons Learned and Future Improvements

### What Worked Well

**Tailscale for Network Management:** The switch from ZeroTier to Tailscale dramatically simplified onboarding and network management. The ability to use reusable authentication keys with automatic tagging made scaling the infrastructure trivial.

**Apache Guacamole for Centralized Access:** Blue team members consistently praised Guacamole for eliminating the complexity of managing multiple remote access tools and credentials. The web-based interface meant they could respond to incidents from any device with a browser.

**Dynamic Verification System:** The Discord bot verification system successfully prevented flag sharing while maintaining automated verification at scale. No manual checking required, and we had timestamped proof of access for every participant.

**Intelligence Feed Transparency:** Making the `#sparksim-bulletin` channel visible to both teams created the desired OPSEC awareness without requiring explicit instruction. Participants learned by seeing their actions from the defender's perspective.

### Areas for Improvement

**Attack Path Complexity:** The linear attack path, while simple to design and manage, limited the exploration and creativity participants could exercise. Future iterations should include multiple paths to objectives, optional lateral movement opportunities, and red herrings to investigate.

**Blue Team Engagement:** While the red team was highly engaged throughout the week, blue team activity was more reactive and episodic. I need to design more proactive defensive objectives—perhaps vulnerability remediation challenges, detection rule creation tasks, or forensic investigation scenarios.

**Scoring Granularity:** The verification system only tracked final C2 access. Future versions should include intermediate objectives on C1 and DC to better track progress and maintain engagement even for participants who don't achieve full compromise.

**Documentation and Debrief:** I didn't maintain detailed enough notes during the event about specific attacks, defensive responses, and learning moments. A structured after-action review with both teams would have captured more valuable lessons learned.

## Conclusion

SparkSIM achieved its primary objective: exposing students to the realities of operational security and the defender's perspective on offensive activities. The exercise successfully bridged the gap between jeopardy CTF skills and professional red teaming requirements.

The most rewarding moment came during the final debrief when several participants said they would approach future penetration tests completely differently, with constant consideration for how defenders would see their actions. Mission accomplished.

For educators and trainers in cybersecurity, I strongly encourage incorporating attack/defense elements into your programs. The technical skills students develop in traditional CTFs are valuable, but understanding the full security ecosystem—attackers, defenders, detection, response—creates more well-rounded security professionals.

Building SparkSIM was a labor of love, but the infrastructure costs were minimal (hosted on my own physically-managed servers), and the learning outcomes far exceeded traditional training approaches. If you're considering running a similar exercise, feel free to reach out—I'm happy to share lessons learned and technical implementation details.

Remember: security is a conversation between attackers and defenders. To truly understand one side, you must experience both.

## Technical Specifications

For those interested in replicating this environment:

**Infrastructure:**
- 1x Windows Server 2022 Datacenter (Evaluation)
- 2x Windows 10 Developer Edition instances (C1,C2)
- 1x Ubuntu 24.04 for DMZ Web Application (BetPortal)
- 1x Ubuntu 24.04 for Wazuh SIEM
- 1x Ubuntu 24.04 for Apache Guacamole
- 1x Ubuntu 24.04 for Discord bot
- Docker and Docker-Compose (for containerised application deployment of Wazuh, Guacamole, Discord bot)
- Tailscale for network connectivity
- Total runtime: 7 days
- Estimated cost: FREE (except for electricity bills :))

**Tools and Services:**
- [Tailscale](https://tailscale.com/) - Zero-config VPN
- [Apache Guacamole](https://guacamole.apache.org/) - Clientless remote desktop gateway
- [Wazuh](https://wazuh.com/) - Open-source SIEM and XDR platform
- [Discord.py](https://discordpy.readthedocs.io/) - Python Discord bot library

The return on investment, measured in participant learning and engagement, was exceptional.
