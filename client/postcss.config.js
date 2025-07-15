// Este é o arquivo de configuração do PostCSS. O PostCSS é uma ferramenta que permite usar plugins para processar seu CSS.
// No caso, estamos configurando dois plugins: o Tailwind CSS e o Autoprefixer.
module.exports = {
    plugins: [
      require('tailwindcss'), // Aqui estamos incluindo o Tailwind CSS, para que seja usado no processamento do CSS.
  
      // O Autoprefixer é um plugin que adiciona prefixos específicos para navegadores mais antigos.
      require('autoprefixer'), // O Autoprefixer é adicionado aqui para adicionar esses prefixos automaticamente.
    ]
}
  