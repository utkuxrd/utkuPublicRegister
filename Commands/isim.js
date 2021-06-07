const { MessageEmbed, Client, Message } = require("discord.js");
const Settings = require("../Settings/Settings.json")
module.exports.run = async (client, message, args) => {

  let yetkili = Settings.Roles.Registerer
  if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has(yetkili)) return message.channel.send(new MessageEmbed().setAuthor("Yetersiz Yetki").setDescription(`**\`»\`** Bu komutu kullanabilmek için \`Admin\` veya \`Kayıt Sorumlusu\` yetkisine sahip olman gerekmekte.`).setColor(Settings.Colors.Red)).then(x => x.delete({ timeout: 6500 }));

  let uyarıembed = new MessageEmbed().setFooter("botclub.net").setTimestamp()
  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  let isim = args[1]
  let yaş = args[2]
  if (!user) return message.channel.send(uyarıembed.setDescription("İsmini değiştireceğin kişiyi etiketlemelisin."))
  if (!isim) return message.channel.send(uyarıembed.setDescription("İsmini değiştireceğin kişinin ismini yazmalısın."))
  if (!yaş) return message.channel.send(uyarıembed.setDescription("İsmini değiştireceğin kişinin yaşını yazmalısın."))
  if (yaş < 13) return message.channel.send(uyarıembed.setDescription("İsmini değiştireceğin üyenin yaşı 13'ten küçük olamaz."))


  user.setNickname(`${Settings.ServerSettings.Tag} ${isim} | ${yaş}`)

  const embed = new MessageEmbed()
  .setDescription(`Başarıyla ${user} üyesinin ismi \`${isim} | ${yaş}\` olarak değişti.`)
  .setColor(Settings.Colors.Gold)
  .setTimestamp()
.setFooter(`botclub.net`)
  message.channel.send(embed)
}

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["isim", "i"]
};

module.exports.help = {
  name: 'isim'
};