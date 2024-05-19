const YEAR = new Date().getFullYear()

const themeConfig = {
  footer: (
    <small style={{ display: 'block', marginTop: '8rem' }}>
      <time>{YEAR}</time> © Marcel Freiberg.
      {/* <a href="/feed.xml">RSS</a> */}
    </small>
  )
}

export default themeConfig
