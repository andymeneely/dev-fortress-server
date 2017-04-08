const DefaultEvents = [
  {
    name: 'A Stupid Bug',
    description: 'Negative values were allowed in the "Quantity" field for purchases, resulting in a fraudulent refund for certain products.',
    default_damage: 26,
    disabled: false,
  },
  {
    name: 'Firmware Flash!',
    description: 'Someone discovers a way to remotely flash the firmware of our embedded devices via a double-free vulnerabillity. They begin disrupting our factory and drone operations, leading to false items being listed in our stores.',
    default_damage: 20,
    disabled: false,
  },
  {
    name: 'iFailed',
    description: 'Apple sheepishly announced that they turned on the Javascript gyroscope API in Safari. Keylogging via side channel attacks becomes commonplace.\nAttackers can tamper with iOS apps. This includes passwords to the warehouse portion of the API.',
    default_damage: 35,
    disabled: false,
  },
  {
    name: 'Engaging the Community Synergy',
    description: 'Our beloved CEO has decided to expand the scope of our services to include a public API and customer access to Cloud Services.\nThe API and Cloud products are now public. Attackers target the hastily-released products, and reverse-engineer how the Web, Factory, Streaming, and Drones work too.',
    default_damage: 35,
    disabled: false,
  },
  {
    name: 'Internal Packet Sniffers!',
    description: 'A network administrator disgruntled by the retirement contribution decrease has installed packet sniffers on the company network in server rooms and in the factories.\nHe siphons the data directly to unscrupulous markets.\nData include: purchases, inventory, drone data, and movies.',
    default_damage: 45,
    disabled: false,
  },
  {
    name: 'Heartshock!',
    description: 'A completely new class of vulnerability is discovered that affects all levels of computing. Nobody thought of this. Only teams with a defense-in-depth mindset were not affected.',
    default_damage: 50,
    disabled: false,
  },
  {
    name: 'Skyjacking!',
    description: 'Hackers figure out how to hijack your delivery drones remotely by leveraging packet sniffing and injection of common flight path commands.\nThey steal a few drones this way and figure out how to flash the firmware if they have physical access.\nNobody notices this at first because the hacker also broke into the pilot servers in the factories using a Java Reflection vulnerability.',
    default_damage: 60,
    disabled: false,
  },
  {
    name: 'StageFright Returns',
    description: 'The Android OS has reported another vulnerability in its video transcoder. It allows the use of compression bombs to root phones. Hackers demonstrate the ability to spoof stored credentials for Rainforest servers. Google failed to tell you about this before disclosing the details. Oops.\nThe media transcoder was also used Android’s library in the Streaming service.\nCEO also comes down hard on iOS team - consultants fire people if proper practices are not followed.',
    default_damage: 60,
    disabled: false,
  },
  {
    name: 'Hollywood Scoop!',
    description: 'With all the buzz about your upcoming comic book-based show, Hollywood bloggers attempt to break into your streaming system to get a scoop.\nThey exploit an injection and a use-after-free vulnerability in the streaming service backend and begin stealing material.',
    default_damage: 60,
    disabled: false,
  },
  {
    name: 'Evil Vendors!',
    description: 'Someone figured out that all you need to sell on Rainforest is a nice smile. And they even give you swipe access.The mafia breaks into your warehouse facilities and accesses internal computers to change the prices of their competitors and use drones to wreak mayhem.',
    default_damage: 40,
    disabled: false,
  },
  {
    name: 'New XSS Exploit',
    description: 'Attackers have developed a new style of cross-site scripting (XSS) attacks. They use the same principles of injection, but with slightly altered techniques that bypass the usual input validation checks',
    default_damage: 50,
    disabled: false,
  },
  {
    name: 'Hactivisim!',
    description: 'Our beloved CEO once accidentally donated to a terrorist organization. A large, anonymous hacktivist group misunderstands this incident and focuses their attention on you with denial of service attacks of a variety of kinds.\nAttacks are compromising all products simultaneously.',
    default_damage: 100,
    disabled: false,
  },
  {
    name: 'Bad Patch!',
    description: 'A developer in the Database Infrastructure released a bad patch that opens administrative access to the Web product via an easy-to-guess password. Vendors and users find out about this.',
    default_damage: 60,
    disabled: false,
  },
  {
    name: 'Competitor Gets Hacked!',
    description: 'Through an unfortunate HVAC software “upgrade”, hackers steal the payment information of millions of your competitor’s customers. Everyone freaks out about this and cyber-security dominates the media narrative.\nYour CEO is adamant that developers must have a “hacker mindset”, or they get fired.',
    default_damage: 30,
    disabled: false,
  },
  {
    name: 'Deadlines!!',
    description: 'A push to “keep up” in the market has swept through the company. The need for security is traded for new functionality.',
    default_damage: 10,
    disabled: false,
  },
  {
    name: 'New, Buggy OS Release',
    description: 'A new operating system release for Windows 10 has a ton of vulnerabilities - this impacts both mobile and desktop.',
    default_damage: 20,
    disabled: false,
  },
  {
    name: 'Screen Scraper Flooding!',
    description: 'Users have discovered ways to monetize your review system by scraping your API continuously. The CEO seems okay with this, which invites hackers to point their botnets to your API and to try to take it down.',
    default_damage: 20,
    disabled: false,
  },
  {
    name: 'New Mobile Platform!',
    description: 'Our beloved CEO has promised in a press conference that we will be supporting Windows phones next month. The port is hastily put together by outside contractors.\nHackers immediately go for Path Traversal and Denial of Service.',
    default_damage: 30,
    disabled: false,
  },
];

module.exports = {
  DefaultEvents,
};
