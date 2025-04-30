export default function FooterMinimal() {
    return (
      <footer className="bg-gray-900 text-gray-300 text-sm p-6 mt-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-semibold mb-2">Team</h4>
            <p>John Doe</p>
            <p>Jane Smith</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p>Phone: +44 1234 567890</p>
            <p>Email: contact@dreambuild.com</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Office</h4>
            <p>45 Baker Street</p>
            <p>London, UK</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Working Hours</h4>
            <p>Mon-Fri: 8:00 - 18:00</p>
            <p>Sat-Sun: Closed</p>
          </div>
        </div>
  
        <div className="text-center mt-6">
          <p>We are <span className="text-blue-400 font-semibold">CertifiedPro</span> approved</p>
          <p className="mt-2 text-gray-500">© 2024 DreamBuild Ltd. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  