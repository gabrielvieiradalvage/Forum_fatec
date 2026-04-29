// DOCUMENTAÇÃO:
// SUPABASE_URL: Usamos apenas o domínio base do projeto.
// SUPABASE_KEY: Usamos a sua 'anon public' key que você enviou.

const SUPABASE_URL = 'https://tcjjdznykunlyqczgcif.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_ZvsQqNXKlOAl9aYDMbNQSA_tSEOpTCL';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Função para postar (Verifique se os nomes das colunas batem com o banco)
async function postarNoSupabase() {
    const user = document.getElementById('nome-usuario').value;
    const msg = document.getElementById('texto-comentario').value;

    if (!user || !msg) return alert("Preencha os campos!");

    // IMPORTANTE: 'usuario' e 'mensagem' devem ser os nomes exatos das colunas no Supabase
    const { error } = await _supabase
        .from('comentarios')
        .insert([{ 
            usuario: user, 
            mensagem: msg, 
            likes: 0 
        }]);

    if (error) {
        alert("Erro ao enviar: " + error.message);
        console.log(error);
    } else {
        document.getElementById('texto-comentario').value = '';
        carregarMensagens();
    }
}
