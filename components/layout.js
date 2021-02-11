import styles from './layout.module.css'

export default function Layout({ children }) {
  return (
    <div>
        <nav class="navbar navbar-expand-sm bg-dark">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <h3 class="splitwiserHeader"> SPLITWISER</h3>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/uploadFile">Upload File</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/executeTransactions">Execute Transactions</a>
                </li>
            </ul>
        </nav>
        <div className="splitwiserPageLayout">{children}</div>
    </div>)
}