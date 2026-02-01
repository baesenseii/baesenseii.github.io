---
title: CSIT TISC 2024 CTF Challenge 3 - Digging Up History
draft: false
categories: [ctf, tisc2024]
Date: 2024-10-16
---
Quite a cheesy description for this challenge, but it looks to me that this is some forensics related stuff that we need to deal with (sigh, i don't really like forensics to be honest haha).

![](/assets/images/tisc-2024/Pasted image 20240930053657.png)

The moment the ZIP file was downloaded and unzipped (password for the ZIP file was located in the provided metadata.txt file), we are presented with the following information:

![](/assets/images/tisc-2024/Pasted image 20241017002917.png)

Just by the file extension alone, it turns out that this is a disk image created using AccessData FTK. There is a free tool called FTK Imager that you can use to access the image (works well on Windows), so I fired up my FLARE VM and installed FTK Imager. Once done, the .ad1 file was loaded and this is what was shown (which looks like a typical C:\ drive of a machine with Windows installed):

![](/assets/images/tisc-2024/Pasted image 20240930053707.png)

Now do note that this is on Windows, and i just hate searching files through the User Interface (because imma leet hacker, and hackerz only use CLI to navigate). So I decided to export out all the files and transfer it to my Linux host machine:

![](/assets/images/tisc-2024/Pasted image 20240930053712.png)

![](/assets/images/tisc-2024/Pasted image 20240930053717.png)

Now one of the main things in Computer Forensics that you would usually do is to get a quick sensing, or a profile of the softwares that are being used. In the Challenge Description it was mentioned that the target of interest has "a history of hiding sensitive data through file sharing sites...", which indicates that it has something to do with web history data. This brings us to the "Application Data" folder for the main user csitfan1, which shows folders whose names represent famous web browses (e.g Mozilla = Firefox, Microsoft = Edge):

![](/assets/images/tisc-2024/Pasted image 20240930053726.png)

The folder Mypal68 was an interesting folder as i have never seen it before, but it turns out that it is also a web browser that allows compatibility of websites powered by new technology such as HTML5, via outdated, unsupported systems such as Windows XP:

![](/assets/images/tisc-2024/Pasted image 20240930053743.png)

And since we can leverage Linux and its powerful string manipulation and file searches using a variety of Linux commands, the following Linux command was used to dump all the URLs visited via the Mypal68 folder (as it was the biggest in file size), and write it to a file called 'urlhistory_mypal68.txt':

```
strings Local Settings/Application Data/Mypal68/Profiles/a80ofn6a.default-default/cache2/* | grep -ar -Eo "(http|https)://[a-zA-Z0-9./?=_%:-]*" | cut -d ":" -f 2,3 | sort -u > ~/Documents/tisc_2024/challenge3/urlhistory_mypal68.txt
```

When going through the list, we see a familiar URL that is notoriously known for file storage (and the filename was a giveaway too):

```
...
...
https://csitfan-chall.s3.amazonaws.com/flag.sus
...
...
```

The file was then downloaded and it turned out to be a Base64-encoded string value. All it took was to use the built-in base64 decoder program in Linux and VOILA, the flag appears :)

![](/assets/images/tisc-2024/Pasted image 20241017004309.png)
![](/assets/images/tisc-2024/Pasted image 20241017004430.png)

Flag: TISC{tru3_1nt3rn3t_h1st0r13_8445632pq78dfn3s}
# Thoughts
I am going to be real honest about this challenge; this one was a bit underwhelming as a CTF challenge. No doubt that yes it seems more of an introduction to computer forensics and file analysis, but i felt that this is even easier than challenge-1, which was the opening challenge.

Maybe one such consideration to be made is to include a 'memory analysis' portion of the challenge (or at least the usage of the Volatility framework), and maybe the memory analysis portion would lead to the password of the ZIP file that contains the disk (I believe it might have been done using a Windows XP Virtual Machine, so you could also provide the .vmem file for the memory analysis portion)

Then i would think that it would be an interesting challenge and probably many people would have benefited a lot more, but good try nevertheless :)
