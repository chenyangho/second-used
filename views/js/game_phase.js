const config = {
    type: Phaser.AUTO,
    width: 3200,
    height: 270,
    parent: 'app',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        // debug: true
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  }


  const game = new Phaser.Game(config)
  // document.getElementById("test").innerHTML = data[0].picture;


  function preload() {
    //----------------------環境物件-----------------------//
    this.load.image('bg1', 'images/assets/background/plx-1.png');
    this.load.image('bg2', 'images/assets/background/plx-2.png');
    this.load.image('bg3', 'images/assets/background/plx-3.png');
    this.load.image('bg4', 'images/assets/background/plx-4.png');
    this.load.image('bg5', 'images/assets/background/plx-5.png');
    this.load.image('footer', 'images/assets/footer.png');

    //----------------------物品物件-----------------------//
    // this.load.image('gem', '<%- bookData[0].picture%>');


    //----------------------腳色物件-----------------------//
    this.load.spritesheet('user', 'images/assets/cha/Knight.png', { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("npc", "images/assets/cha/npc.png", { frameWidth: 30, frameHeight: 32 })

    //------------------用迴圈創建入書本圖片--------------------//
    for (let i = 0; i < data.length; i++) {
      this.load.image('book' + i.toString(), data[i].picture);
    }

  }

  function create() {
    const width = this.scale.width
    const height = this.scale.height

    console.log(width, height)

    //----------------------環境物件-----------------------//
    this.bg1 = this.add.tileSprite(width / 2, height / 2, width * 2, height, 'bg1')     //背景1
    this.bg2 = this.add.tileSprite(width / 2, height / 2, width * 2, height, 'bg2')     //背景2
    this.bg3 = this.add.tileSprite(width / 2, height / 2, width * 2, height, 'bg3')     //背景3
    this.bg4 = this.add.tileSprite(width / 2, height / 2, width * 2, height, 'bg4')     //背景4
    this.bg5 = this.add.tileSprite(width / 2, height / 2, width * 2, height, 'bg5')     //背景5
    this.footer = this.add.tileSprite(0, 230, width * 9, 66, 'footer').setScale(1.55)   //地板


    //----------------------物品物件-----------------------//
    var gem = []             //books image
    var text = []            //books detial
    for (let i = 0; i < data.length; i++) {
      //add books data
      gem[i] = this.add.image(600 + (i * 300), 90, 'book' + i.toString()).setScale(0.15);
      gem[i].setDataEnabled();
      gem[i].data.set('bookname', data[i].bookname);
      gem[i].data.set('owner', data[i].owner);
      gem[i].data.set('price', data[i].price);
      gem[i].data.set('sold', data[i].sold);
      gem[i].data.set('npc_id', i + 1)

      //add books text 
      text[i] = this.add.text(650 + (i * 300), 50, '', { font: '16px Courier', fill: '#000' });
      text[i].setText([
        'Name: ' + gem[i].data.get('bookname'),
        'Owner: ' + gem[i].data.get('owner'),
        'Price : ' + '$' + gem[i].data.get('price'),
        'Sold : ' + gem[i].data.get('sold')
      ]);
      //----------------------物件透明度-----------------------//
      gem[i].alpha = 0
      text[i].alpha = 0
    }

    //----------------------player左右動畫-----------------------//
    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers('user', { start: 10, end: 19 }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('user', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('user', { start: 20, end: 29 }),
      frameRate: 10,
      repeat: -1,
    })

    //-------------------------npc動畫--------------------------//
    this.anims.create({
      key: 'npc_ani',
      frames: this.anims.generateFrameNumbers('npc', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    })

    //----------------------腳色物件-----------------------//
    this.player = this.physics.add.sprite(400, 120, 'user')
      .setBounce(0.2)
      .setCollideWorldBounds(true)
      .setScale(1.5);

    this.castel = this.physics.add.sprite(100, 0, 'npc')
      .setBounce(0.2)
      .setCollideWorldBounds(true)
      .setScale(8)

    this.npc = []
    for (let i = 0; i < data.length; i++) {
      this.npc[i] = this.physics.add.sprite(600 + (i * 300), 120, 'npc')
        .setBounce(0.2)
        .setCollideWorldBounds(true)
        .setScale(1.5)
      this.npc[i].data = i
      this.npc[i].flipX = true; //左右反轉
      this.npc[i].play("npc_ani")
    }

    // this.npcs = this.physics.add.group({
    //   key: 'npc',
    //   repeat: 7,
    //   setXY: { x: 900, y: 120, stepX: 150 },
    //   setScale: { x: 2, y: 2}
    // })
    // this.npcs.children.iterate(npc => {
    //   npc.play("npc_ani")
    //   .flipX = true;
    // })
    //----------------------創建群組-----------------------//


    //----------------------鏡頭移動-----------------------//
    // this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.startFollow(this.player, true)

    //---------------------物理效果處理-----------------------//
    //地板物理處理//
    this.physics.add.existing(this.footer);
    this.footer.body.immovable = true;
    this.footer.body.moves = false;

    //允許碰撞
    this.physics.add.collider(this.npc, this.footer)
    this.physics.add.collider(this.castel, this.footer)
    this.physics.add.collider(this.player, this.footer)

    //重疊判定
    for (let i = 0; i < data.length; i++) {
      this.physics.add.overlap(this.player, this.npc[i], listener, null, this)
    }
    this.physics.add.overlap(this.player, this.castel, other_web, null, this)


    //-------------------讀取方向鍵輸入-----------------------//
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    //-------------------一些函式-----------------------//
    function listener(player, npc) {
      var number = npc.data
      gem[number].alpha = 1
      text[number].alpha = 1
      this.time.addEvent({
        delay: 500,
        callback: () => {
          gem[number].alpha = 0
          text[number].alpha = 0
        },
        loop: true
      })
      document.getElementById('book_detail').style.visibility = 'visible'
      document.getElementById("img1").src = data[number].picture
      document.getElementById("name").innerHTML = data[number].bookname
      document.getElementById("owner").innerHTML = data[number].owner
      document.getElementById("price").innerHTML = "¥" + data[number].price
      document.getElementById("sold").innerHTML = data[number].sold
      document.getElementById("seller_name").innerHTML = data[number].owner
      document.getElementById("add-btn").setAttribute("data-uniID", data[number].unique_id)
      document.getElementById("add-btn").setAttribute("data-npcid", npc.data)
    
    }

    function other_web() {
      if (this.spaceKey.isDown) {
        // location.href = "https://www.google.com.tw/"
        //ejs裡#是comment
        // var url = "<%= go_to_where%>";
        // location.href = url;
      }
    }
  }


  function update() {
    const cam = this.cameras.main
    const speed = 3

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200)
      this.player.anims.play('left', true)
      cam.scrollX -= speed
      this.bg1.tilePositionX -= 0;
      this.bg2.tilePositionX -= 1.2;
      this.bg3.tilePositionX -= 1.4;
      this.bg4.tilePositionX -= 1.6;
      this.bg5.tilePositionX -= 1.8;
      this.footer.tilePositionX -= 1.5;

    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200)
      this.player.anims.play('right', true)
      cam.scrollX += speed
      this.bg1.tilePositionX += 0;
      this.bg2.tilePositionX += 1.2;
      this.bg3.tilePositionX += 1.4;
      this.bg4.tilePositionX += 1.6;
      this.bg5.tilePositionX += 1.8;
      this.footer.tilePositionX += 1.5;
    } else {
      this.player.setVelocityX(0)
      this.player.anims.play('turn', true)
    }
  }
