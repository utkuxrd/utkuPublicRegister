const { dc, MessageEmbed } = require('discord.js')
const db = require('quick.db')
const Settings = require('../Settings/Settings.json')
const Other = require('../Settings/Other.json')
exports.run = async (client, message, args) => {
  
if(![(Settings.Roles.Registerer)].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.reply(`Bu Komut İçin Yetkiniz Bulunmamaktadır.`) 

const sıra = await db.fetch('case')
const emoji = message.guild.emojis.cache.find(r => r.name === (Other.EmojiGeneral.Emoji1)) 
const chat = message.guild.channels.cache.find(r => r.id === (Settings.Channels.GeneralChat)) 

let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
let isim = args[1]
let yaş = args[2]
let uyarıembed = new MessageEmbed().setColor(Settings.Colors.Red).setFooter("botclub.net").setTimestamp()
if (!user) return message.channel.send(uyarıembed.setDescription("İsmini değiştireceğin kişiyi etiketlemelisin."))
if (!isim) return message.channel.send(uyarıembed.setDescription("İsmini değiştireceğin kişinin ismini yazmalısın."))
if (!yaş) return message.channel.send(uyarıembed.setDescription("İsmini değiştireceğin kişinin yaşını yazmalısın."))
if (yaş < 13) return message.channel.send(uyarıembed.setDescription("İsmini değiştireceğin üyenin yaşı 13'ten küçük olamaz."))

if (user.user.tag.includes(Settings.ServerSettings.Tag)) {
    user.setNickname(`${Settings.ServerSettings.Tag} ${isim} | ${yaş}`)
  } else {
    user.setNickname(`${Settings.ServerSettings.UnTag} ${isim} | ${yaş}`)
  }

user.roles.add(Settings.Roles.GirlRole1)
user.roles.add(Settings.Roles.GirlRole2)
user.roles.remove(Settings.Roles.Unregister)

await db.push(`isimler.${user.id}`, {
  Registerer: message.author.id,
  Name: isim,
  Age: yaş,
  Rol: Settings.Roles.GirlRole1
})

db.add(`${message.author.id}.toplam`, +1)
db.add(`${message.author.id}.erkek`, +1)
db.add('case', 1)
let toplam = await db.get(`${message.author.id}.toplam`)

  let x = await db.get(`isimler.${user.id}`)
  let isimler = x.length > 0 ? x.map((value, index) => `**${index + 1})** \`${value.Name} | ${value.Age}\` (${value.Rol})`).join(`\n`) : "Bu Kullanıcının Önceden Bulunan Bir İsmi Yok.";
  let embed = new MessageEmbed()
    .setAuthor(user.user.tag, user.user.avatarURL({ dynamic: true }))
    .setColor(Settings.Colors.Green)
    .setDescription(`• ${user}, <@${message.author.id}> Tarafından Kaydedildi.
    • ${user} Kişisinin Adı \`${isim} | ${yaş}\` Olarak Değiştirildi.
    • <@&${Settings.Roles.GirlRole1}>, <@&${Settings.Roles.GirlRole2}> Başarıyla Verildi.
    • Kayıt Sırası: **#${sıra || "1"}**
`)
.setFooter(`${message.author.username} Yetkilisinin Toplam ${toplam} Kaydı Oldu.`)
.setTimestamp()
message.channel.send(embed)
message.react(emoji)

const dmlog = new MessageEmbed()
.setDescription(`• ${user} Tebrikler, \`${message.guild.name}\` Sunucusunda \`Kadın\` Olarak Kaydedildin.
• İsmin \`${isim} | ${yaş}\` Olarak Değiştirildi.`)
.setFooter(`Eğer Kaydında Bir Yanlışlık Varsa Yetkililere Bildir Lütfen.`)
.setColor(Settings.Colors.Blue)
user.send(dmlog)
  
  const chatembed = new MessageEmbed()
.setDescription(`${user} Aramıza Hoşgeldin Dostum, Keyifli Vakitler Geçirmeni Dileriz.`)
.setTimestamp()
.setFooter(Settings.ServerSettings.ServerName)
.setColor(Settings.Colors.Blue)
chat.send(chatembed)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["kadın", "k", "woman", "girl"],
    permLevel: 0
};

exports.help = {
    name: "kadın"
}