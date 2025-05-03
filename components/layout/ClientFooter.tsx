export default function ClientFooter() {
    return (
        <footer className="w-full border-t bg-gray-50 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 text-center">
                &copy; {new Date().getFullYear()} TEST Company. All rights reserved.
            </div>
        </footer>
    );
}
