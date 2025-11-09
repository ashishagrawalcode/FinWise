import { useState } from "react";
import { useAuth } from "@/hooks/useLocalStorage";
import { useFinancialState } from "@/hooks/useFinancialState";
import type { UserProfile } from "@shared/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Camera, Lock, Mail, Phone, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Profile() {
  const [authState, setAuthState] = useAuth();
  const { state } = useFinancialState(authState.user?.email || "");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: authState.user?.name || "",
    email: authState.user?.email || "",
    phone: "",  // Phone is not stored in AuthUser
    profilePhoto: "",  // Profile photo is not stored in AuthUser
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateProfile = () => {
    // Update profile logic here
    setAuthState.updateUser({
      name: formData.name
      // phone is not part of AuthUser interface
    });
    setIsEditMode(false);
  };

  const handlePasswordChange = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Password change logic here
  };

  const handleDeleteAccount = () => {
    // Account deletion logic here
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-8">
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Manage your account settings and preferences</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={formData.profilePhoto} />
                    <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-1 bg-primary-600 rounded-full text-white">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="flex gap-2">
                      <Input
                        disabled={!isEditMode}
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your full name"
                      />
                      <Button
                        variant={isEditMode ? "default" : "outline"}
                        onClick={() => {
                          if (isEditMode) {
                            handleUpdateProfile();
                          }
                          setIsEditMode(!isEditMode);
                        }}
                      >
                        {isEditMode ? "Save" : "Edit"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      disabled
                      value={formData.email}
                      type="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      disabled={!isEditMode}
                      value={formData.phone}
                      onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                      type="tel"
                      placeholder="+91 "
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">XP Earned</p>
                  <p className="text-2xl font-bold text-primary-600">{state.user.xp.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Net Worth</p>
                  <p className="text-2xl font-bold text-green-600">₹{state.financialHub.netWorth.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lessons Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{state.user.completedLessons.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Make sure to use a strong, unique password
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData(p => ({ ...p, currentPassword: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData(p => ({ ...p, newPassword: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button onClick={handlePasswordChange} className="w-full">
                      Update Password
                    </Button>
                  </DialogContent>
                </Dialog>

                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                          All your data including financial records, progress, and achievements will be permanently deleted.
                        </AlertDescription>
                      </Alert>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        className="w-full"
                      >
                        Yes, Delete My Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}