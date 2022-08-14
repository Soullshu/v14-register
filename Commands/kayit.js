const a = require("../settings.js");
const Discord = require("discord.js");
const isimler = require("../Models/names");
const regstats = require("../Models/registerStats");
module.exports = {
    name: 'kayit',
    description: 'kullanıcıyı kayıt edersin',
    aliases: ['k', 'e', 'kayit', 'kayıt'],
    usage: `kayit @Kullanıcı/İD İsim/Yaş`,
    cooldown: 5,
    /**@param {Discord.Message} messageCreate
     * @param {Array} args
     * @param {Discord.Client} client
     */

    
  async execute(message, args, client, embed) {
let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if(!a.roles.registerStaff.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) {
    message.reply(`Yetkin bulunmamakta dostum.\Yetkili olmak istersen başvurabilirsin.`).then(x => setTimeout(() => x.delete(), 5000))
    return }
    if(!uye) 
    {
    message.reply(`\`.kayit <@DarkDays/ID> <Isim>\``).then(x => setTimeout(() => x.delete(), 5000))
      return }
    if(message.author.id === uye.id) 
    {
    message.reply(`Kendini kayıt edemezsin.`).then(x => setTimeout(() => x.delete(), 5000))
    return }
    if(!uye.manageable) 
    {
    message.reply(`Böyle birisini kayıt edemiyorum.`).then(x => setTimeout(() => x.delete(), 5000))
    return }
    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
     message.reply(`Senden yüksekte olan birisini kayıt edemezsin.`).then(x => setTimeout(() => x.delete(), 5000))
     return }
    const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
   if(!isim) 
    {
    message.reply(`\`.kayit <@DarkDays/ID> <Isim>\``).then(x => setTimeout(() => x.delete(), 5000))
       return }
  if(!isim)
      { setName = `${uye.user.username.includes(a.guild.tags) ? a.guild.tags : (a.guild.defaultTag ? a.guild.defaultTag : (a.guild.tag || ""))} ${isim}`;
      } else { setName = `${uye.user.username.includes(a.guild.tags) ? a.guild.tags : (a.guild.defaultTag ? a.guild.defaultTag : (a.guild.tag || ""))} ${isim}`;
    }
    if (data && data.tagMode === true) {
    if(!a.guild.tags.some(t => !uye.user.username.includes(t) && uye.user.discriminator.includes(t) && !uye.roles.cache.get(a.roles.boosterRole) && !uye.roles.cache.get(a.roles.vipRole) && (x => uye.roles.cache.get(x)))) return message.reply({embeds: [embed.setDescription(`${uye.toString()} isimli üyenin kullanıcı adında tagımız (\`${a.guild.tags}\`) ve <@&${a.roles.boosterRole}>, <@&${a.roles.vipRole}> Rolleri olmadığı için isim değiştirmekden başka kayıt işlemi yapamazsınız.`)]}).then(x => setTimeout(() => x.delete(), 5000))
    }                 
  const datas = await regstats.findOne({ guildID: message.guild.id, userID: message.author.id });
    message.reply({embeds: [embed.setDescription(`
${uye.toString()} üyesinin ismi başarıyla \`${(setName)}\` olarak değiştirildi. Bu üye daha önce bu isimlerle kayıt olmuş.
    
${message.guild.emojis.cache.find(x => x.name == "red")} Kişinin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu.
${data ? data.names.splice(0, 3).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol}) (<@${x.yetkili}>) [ <t:${Math.floor(x.date / 1000)}> ]`).join("\n") : ``}    

${message.guild.emojis.cache.find(x => x.name == "uyari")} Kişinin önceki isimlerine \`.isimler @DarkDays/ID\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir `)
.setAuthor({name: uye.displayName, iconURL: uye.user.displayAvatarURL({ dynamic: true })})
.setFooter({text: `• Toplam kayıt: ${datas ? datas.top : 0}`}).setTimestamp()]})
await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: a.roles.memberRoles.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, erkek: 1, erkek24: 1, erkek7: 1, erkek14: 1, }, }, { upsert: true });
await uye.roles.add(a.roles.memberRoles)
await uye.roles.remove(a.roles.unregisterRoles)
await uye.setNickname(setName)      
}
  }