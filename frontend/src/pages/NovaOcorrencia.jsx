import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function NovaOcorrencia() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '', descricao: '', categoria: '', localizacao: '', imagemUrl: '', prioridade: 'MEDIA',
  });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const set = (c, v) => setForm((f) => ({ ...f, [c]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      const { data } = await api.post('/ocorrencias', form);
      navigate(`/ocorrencias/${data.id}`);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="card">
      <h1>Nova ocorrência</h1>
      {erro && <div className="alert-erro">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <label>Título
          <input value={form.titulo} onChange={(e) => set('titulo', e.target.value)} required />
        </label>
        <label>Descrição
          <textarea rows="4" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} required />
        </label>
        <label>Categoria
          <input value={form.categoria} onChange={(e) => set('categoria', e.target.value)} required
            placeholder="Ex.: Iluminação, Limpeza, Segurança" />
        </label>
        <label>Localização
          <input value={form.localizacao} onChange={(e) => set('localizacao', e.target.value)} />
        </label>
        <label>Imagem (URL)
          <input value={form.imagemUrl} onChange={(e) => set('imagemUrl', e.target.value)}
            placeholder="https://..." />
        </label>
        <label>Prioridade
          <select value={form.prioridade} onChange={(e) => set('prioridade', e.target.value)}>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
          </select>
        </label>
        <button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Registrar'}</button>
      </form>
    </div>
  );
}
