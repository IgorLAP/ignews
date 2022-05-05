import styles from './styles.module.scss';
import Head from 'next/head';

export default function Posts(){
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.postList}>
                    <a href=''>
                        <time>05 de maio de 2022</time>
                        <strong>Narutinho testando noticias</strong>
                        <p>Os méritos passam pelo tratamento aos “fan services” à maneira feita na animação Homem-aranha no Aranhaverso, sendo assim, ter a jornada de</p>
                    </a>
                    <a href=''>
                        <time>05 de maio de 2022</time>
                        <strong>Narutinho testando noticias</strong>
                        <p>Os méritos passam pelo tratamento aos “fan services” à maneira feita na animação Homem-aranha no Aranhaverso, sendo assim, ter a jornada de</p>
                    </a>
                    <a href=''>
                        <time>05 de maio de 2022</time>
                        <strong>Narutinho testando noticias</strong>
                        <p>Os méritos passam pelo tratamento aos “fan services” à maneira feita na animação Homem-aranha no Aranhaverso, sendo assim, ter a jornada de</p>
                    </a>
                </div>
            </main>
        </>
    )
}